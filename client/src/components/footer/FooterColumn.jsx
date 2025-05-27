const FooterColumn = ({ title, items }) => {
  return (
    <div>
      <h4 className="text-sm font-semibold mb-3 uppercase">{title}</h4>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx}>
            {item.icon ? (
              <a
                href={item.link}
                className="flex items-center gap-2 text-sm hover:underline"
              >
                <span>{item.icon}</span> {item.label}
              </a>
            ) : (
              <a href={item.link} className="text-sm hover:underline">
                {item.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FooterColumn;
