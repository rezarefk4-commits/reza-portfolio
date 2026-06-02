"use client";
import { useState } from "react";
import { Column, Row, Text, Button, Input, Line, Card } from "@once-ui-system/core";
import { createClient } from "@/lib/supabase/client";
import type { AboutSkill } from "@/lib/types";

interface Props { initialData: AboutSkill[]; }
const empty = (): Omit<AboutSkill,"id"|"created_at"|"updated_at"> => ({
  title_id:"", title_en:"", description_id:"", description_en:"", icon:"", sort_order:0,
});

export function SkillsClient({ initialData }: Props) {
  const [items, setItems]     = useState<AboutSkill[]>(initialData);
  const [editing, setEditing] = useState<Partial<AboutSkill>|null>(null);
  const [isNew, setIsNew]     = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg]         = useState("");
  const set = (k:string,v:unknown) => setEditing((e) => e?{...e,[k]:v}:e);
  const ta = { background:"var(--neutral-background-medium)",border:"1px solid var(--neutral-alpha-medium)",
    borderRadius:8,padding:"10px 12px",color:"var(--neutral-on-background-strong)",fontSize:14,width:"100%",fontFamily:"inherit",resize:"vertical" as const };

  const handleSave = async () => {
    if (!editing?.title_id) { setMsg("Judul wajib diisi."); return; }
    setLoading(true); setMsg("");
    const supabase = createClient();
    const payload = { ...editing, updated_at: new Date().toISOString() };
    if (isNew) {
      const { data, error } = await supabase.from("about_skills")
        .insert([{...payload,created_at:new Date().toISOString()}]).select().single();
      if (error) setMsg(error.message);
      else { setItems((p)=>[...p,data]); setEditing(null); }
    } else {
      const { error } = await supabase.from("about_skills").update(payload).eq("id",editing.id!);
      if (error) setMsg(error.message);
      else { setItems((p)=>p.map((x)=>x.id===editing.id?{...x,...editing} as AboutSkill:x)); setEditing(null); }
    }
    setLoading(false);
  };

  const handleDelete = async (id:string) => {
    if (!confirm("Hapus skill ini?")) return;
    await createClient().from("about_skills").delete().eq("id",id);
    setItems((p)=>p.filter((x)=>x.id!==id));
    if (editing?.id===id) setEditing(null);
  };

  if (editing!==null) return (
    <Column fillWidth gap="l" paddingBottom="80">
      <Column gap="m" border="neutral-alpha-weak" radius="l" padding="l" background="surface">
        <Text variant="label-strong-m">{isNew?"Tambah Keahlian":"Edit Keahlian"}</Text>
        <Line background="neutral-alpha-weak" />
        <Row gap="m" s={{direction:"column"}}>
          <Column gap="s" flex={1}><Text variant="label-strong-s">Judul (ID) *</Text>
            <Input id="ti" value={editing.title_id??""} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>set("title_id",e.target.value)} placeholder="Frontend Development" /></Column>
          <Column gap="s" flex={1}><Text variant="label-strong-s">Title (EN)</Text>
            <Input id="te" value={editing.title_en??""} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>set("title_en",e.target.value)} placeholder="Frontend Development" /></Column>
        </Row>
        <Column gap="s"><Text variant="label-strong-s">Icon Emoji</Text>
          <Input id="ic" value={editing.icon??""} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>set("icon",e.target.value)} placeholder="⚡ 🎨 🔧 📊" /></Column>
        <Column gap="s"><Text variant="label-strong-s">Deskripsi (ID)</Text>
          <textarea value={editing.description_id??""} onChange={(e)=>set("description_id",e.target.value)} rows={4} placeholder="Teknologi dan tools yang dikuasai..." style={ta} /></Column>
        <Column gap="s"><Text variant="label-strong-s">Description (EN)</Text>
          <textarea value={editing.description_en??""} onChange={(e)=>set("description_en",e.target.value)} rows={4} placeholder="Technologies and tools mastered..." style={ta} /></Column>
        <Column gap="s"><Text variant="label-strong-s">Urutan Tampil</Text>
          <Input id="so" type="number" value={String(editing.sort_order??0)} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>set("sort_order",parseInt(e.target.value)||0)} /></Column>
      </Column>
      {msg && <Text variant="body-default-s" onBackground="danger-strong">{msg}</Text>}
      <Row gap="m" wrap>
        <Button onClick={handleSave} variant="primary" size="m" loading={loading}>{isNew?"Tambah":"Simpan"}</Button>
        <Button onClick={()=>setEditing(null)} variant="secondary" size="m">Batal</Button>
        {!isNew && <Button onClick={()=>handleDelete(editing.id!)} variant="danger" size="m" style={{marginLeft:"auto"}}>Hapus</Button>}
      </Row>
    </Column>
  );

  return (
    <Column fillWidth gap="m">
      <Button onClick={()=>{setEditing(empty());setIsNew(true);}} variant="primary" size="m" prefixIcon="plus">Tambah Keahlian</Button>
      {items.length===0 && (
        <Card border="neutral-alpha-weak" background="surface" padding="xl" radius="l">
          <Column gap="m" horizontal="center" align="center">
            <Text style={{fontSize:48}}>⚡</Text>
            <Text variant="heading-strong-m">Belum ada keahlian</Text>
          </Column>
        </Card>
      )}
      {items.map((skill) => (
        <Card key={skill.id} fillWidth border="neutral-alpha-weak" background="surface" padding="m" radius="l"
          onClick={()=>{setEditing(skill);setIsNew(false);}} style={{cursor:"pointer"}}>
          <Row fillWidth horizontal="between" vertical="center">
            <Row gap="8" vertical="center" flex={1}>
              {skill.icon && <Text style={{fontSize:24}}>{skill.icon}</Text>}
              <Column gap="4">
                <Text variant="heading-strong-m">{skill.title_id}</Text>
                {skill.description_id && <Text variant="body-default-xs" onBackground="neutral-weak"
                  style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:260}}>
                  {skill.description_id.slice(0,60)}...</Text>}
              </Column>
            </Row>
            <Text variant="body-default-xs" onBackground="neutral-weak">Edit →</Text>
          </Row>
        </Card>
      ))}
    </Column>
  );
}
