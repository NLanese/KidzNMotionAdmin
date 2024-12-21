import Link from "next/link";

const BasicLink = (props) => {
  const { realLink, href, content, children, fontStyle, color, scroll, shallow, ...rest } = props;

  if (realLink) {
    return (
      <a href={href} style={{ fontStyle, color }} {...rest}>
        {content || children}
      </a>
    );
  }

  return (
    <Link href={href} scroll={scroll} shallow={shallow} {...rest}>
      {content || (
        <span style={{ fontStyle, color }}>
          {children}
        </span>
      )}
    </Link>
  );
};

export default BasicLink;
