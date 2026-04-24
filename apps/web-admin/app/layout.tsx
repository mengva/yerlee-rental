import localFont from "next/font/local";
import "@workspace/ui/globals.css"
import { Providers } from "@/components/providers"
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { TRPCProvider } from "./trpc";

const customizeFont = localFont({
  src: "../../../packages/src/fonts/Phetsarath_OT.ttf",
  variable: "--Phetsarath_OT",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={customizeFont.className}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          enableColorScheme
        >
          <div id="web" className="w-full h-screen fixed inset-0 overflow-y-auto">
            <TRPCProvider>
              <Providers>
                <>
                  {children}
                  <Toaster position="bottom-right" />
                </>
              </Providers>
            </TRPCProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
