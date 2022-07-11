import Link from "next/link";

// Used in place of the Next LInk > A with the as, href, and Pass Href
// Consolodates these 5 items into a more conviente components
// Best used for pure A tag text links that dont require additional image Contetent
const BasicLink = (props) => (
  <>
    {props.realLink ? (
      <a href={props.href}>{props.content ? props.content : props.children}</a>
    ) : (
      <Link href={props.href} passHref={true} scroll={props.scroll} shallow={props.shallow}>
        <a fontStyle={props.fontStyle} color={props.color}>
          {props.content ? props.content : props.children}
        </a>
      </Link>
    )}
  </>
);

export default BasicLink;
