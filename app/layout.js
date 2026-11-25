import "./globals.css";

export const metadata = {
  title: "BR GOLF | 골프 포털",
  description: "부산 사직동과 주변 골프장, 연습장, 라운드 준비 정보를 한곳에서 찾아보세요.",
};

export default function RootLayout({ children }) {
  return <html lang="ko"><body>{children}</body></html>;
}
