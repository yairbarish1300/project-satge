interface TableFooterProps {
  summary: string;
  pageCount: number;
  activePage: number;
}

export default function TableFooter({ summary, pageCount, activePage }: TableFooterProps) {
  return (
    <div className="orders-table-foot">
      <p className="orders-foot-copy">{summary}</p>
      <div className="orders-pag">
        <button><span className="msym msym-16">chevron_right</span></button>
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
          <button key={page} className={page === activePage ? 'active' : undefined}>{page}</button>
        ))}
        <button><span className="msym msym-16">chevron_left</span></button>
      </div>
    </div>
  );
}
