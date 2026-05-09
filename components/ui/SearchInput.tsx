type SearchInputProps = {
  defaultValue?: string;
  placeholder?: string;
};

export function SearchInput({ defaultValue = "", placeholder = "搜尋症狀或部位" }: SearchInputProps) {
  return (
    <form action="/search" className="search-form">
      <input
        aria-label="搜尋症狀"
        className="search-input"
        defaultValue={defaultValue}
        name="q"
        placeholder={placeholder}
        type="search"
      />
      <button className="search-submit" type="submit" aria-label="搜尋">
        搜尋
      </button>
    </form>
  );
}
