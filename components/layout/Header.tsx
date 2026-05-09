import Link from "next/link";
import { SearchInput } from "@/components/ui/SearchInput";

export function Header() {
  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="症狀導航首頁">
        <span className="brand-mark">十</span>
        <span>症狀導航</span>
      </Link>
      <nav className="site-nav" aria-label="主要導覽">
        <Link href="/search">搜尋</Link>
      </nav>
      <div className="header-search">
        <SearchInput />
      </div>
    </header>
  );
}
