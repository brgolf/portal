import "./globals.css";

export const metadata = {
  title: "BR GOLF | 골프 포털",
  description: "골프장, 연습장과 라운드 준비 정보를 한곳에서 찾아보세요.",
};

export default function RootLayout({ children }) {
  return <html lang="ko"><body>{children}</body></html>;
}
