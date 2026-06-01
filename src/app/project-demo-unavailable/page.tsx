import { Column, Heading, Text, Button } from "@once-ui-system/core";

export default function ProjectDemoUnavailable() {
  return (
    <Column maxWidth="s" horizontal="center" gap="l" paddingY="80" align="center">
      <Heading variant="display-strong-l" align="center">
        Demo Tidak Tersedia
      </Heading>
      <Text variant="body-default-l" onBackground="neutral-weak" align="center">
        Maaf, demo untuk proyek ini sedang tidak tersedia saat ini. Silakan hubungi saya untuk
        informasi lebih lanjut.
      </Text>
      <Button href="/work" variant="secondary" arrowIcon>
        Kembali ke Proyek
      </Button>
    </Column>
  );
}
