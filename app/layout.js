import Navbar from "./components/Navbar"
import "./globals.css"
import Providers from "./components/Providers"

export default function RootLayout({children}){
  return (
    <html lang = "en">
      <body className="bg-black"> 
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  )
}