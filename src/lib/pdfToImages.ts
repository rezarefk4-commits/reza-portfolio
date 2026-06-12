/**
 * pdfToImages.ts
 * Convert PDF ke array File JPG menggunakan pdfjs-dist v4 via CDN (UMD build).
 * Load script CDN sekali via <script> tag, render tiap halaman ke canvas → JPG.
 *
 * Kenapa CDN dan bukan npm import?
 * pdfjs-dist v6 (npm) adalah pure ESM tanpa UMD build, tidak kompatibel dengan
 * Next.js Turbopack bundling. CDN v4 expose window.pdfjsLib (UMD) yang reliable.
 */

export interface PdfConversionResult {
  pages: File[];
  pageCount: number;
  originalName: string;
}

export interface PdfConversionProgress {
  page: number;
  total: number;
  pct: number;
}

const PDFJS_VERSION = "4.4.168";
const PDFJS_BASE = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}`;

interface PdfjsLib {
  getDocument(src: { data: ArrayBuffer }): { promise: Promise<PDFDocumentProxy> };
  GlobalWorkerOptions: { workerSrc: string };
}

interface PDFDocumentProxy {
  numPages: number;
  getPage(n: number): Promise<PDFPageProxy>;
}

interface PDFPageProxy {
  getViewport(p: { scale: number }): PDFViewport;
  render(p: { canvasContext: CanvasRenderingContext2D; viewport: PDFViewport }): { promise: Promise<void> };
}

interface PDFViewport {
  width: number;
  height: number;
}

let _loadPromise: Promise<PdfjsLib> | null = null;

function loadPdfJsFromCDN(): Promise<PdfjsLib> {
  if (_loadPromise) return _loadPromise;

  _loadPromise = new Promise<PdfjsLib>((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    if (w.pdfjsLib?.getDocument) {
      w.pdfjsLib.GlobalWorkerOptions.workerSrc = `${PDFJS_BASE}/pdf.worker.min.js`;
      return resolve(w.pdfjsLib as PdfjsLib);
    }

    const script = document.createElement("script");
    script.src = `${PDFJS_BASE}/pdf.min.js`;
    script.async = true;

    script.onload = () => {
      if (!w.pdfjsLib?.getDocument) {
        _loadPromise = null;
        return reject(new Error("pdfjs tidak ter-load dari CDN"));
      }
      w.pdfjsLib.GlobalWorkerOptions.workerSrc = `${PDFJS_BASE}/pdf.worker.min.js`;
      resolve(w.pdfjsLib as PdfjsLib);
    };

    script.onerror = () => {
      _loadPromise = null;
      // Fallback ke unpkg
      const s2 = document.createElement("script");
      s2.src = `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/legacy/build/pdf.min.js`;
      s2.async = true;
      s2.onload = () => {
        if (!w.pdfjsLib?.getDocument) {
          _loadPromise = null;
          return reject(new Error("pdfjs gagal di-load dari CDN manapun"));
        }
        w.pdfjsLib.GlobalWorkerOptions.workerSrc =
          `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/legacy/build/pdf.worker.min.js`;
        resolve(w.pdfjsLib as PdfjsLib);
      };
      s2.onerror = () => {
        _loadPromise = null;
        reject(new Error("pdfjs gagal di-load dari CDN manapun"));
      };
      document.head.appendChild(s2);
    };

    document.head.appendChild(script);
  });

  return _loadPromise;
}

/**
 * Convert file PDF ke array File JPG (satu per halaman).
 * @param file    File PDF input
 * @param scale   Skala render — 2.0 ≈ 150dpi, cukup tajam untuk web
 * @param quality JPEG quality 0–1
 */
export async function pdfToImages(
  file: File,
  {
    scale = 2.0,
    quality = 0.88,
    onProgress,
  }: {
    scale?: number;
    quality?: number;
    onProgress?: (p: PdfConversionProgress) => void;
  } = {}
): Promise<PdfConversionResult> {
  const pdfjsLib = await loadPdfJsFromCDN();

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const pageCount = pdf.numPages;
  const baseName = file.name.replace(/\.pdf$/i, "");
  const pages: File[] = [];

  for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
    onProgress?.({
      page: pageNum,
      total: pageCount,
      pct: Math.round(((pageNum - 1) / pageCount) * 90),
    });

    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d")!;

    await page.render({ canvasContext: ctx, viewport }).promise;

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("Canvas toBlob gagal"))),
        "image/jpeg",
        quality
      );
    });

    const suffix = pageCount > 1 ? `-hal${pageNum}` : "";
    pages.push(new File([blob], `${baseName}${suffix}.jpg`, { type: "image/jpeg" }));

    // Cleanup memory
    canvas.width = 0;
    canvas.height = 0;
  }

  onProgress?.({ page: pageCount, total: pageCount, pct: 100 });
  return { pages, pageCount, originalName: file.name };
}
