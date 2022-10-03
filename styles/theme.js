// Base Theme Styles
let theme = {
    colors: {
        primary: "#f0932b",
        lightPrimary: "#badc58",
        darkPrimary: "#f0932b",
        backgroundColor: "#f6f6f7",
        secondaryBackgroundColor: "#f1f2f3",
        danger: "#c0392b"
    },
    gradients: {
        main:  "linear-gradient(155deg,rgb(73 163 246) 25%,rgb(15 106 191) 100%)"
    },
    boxShadow: {
        blurred: "0px 1px 9px rgb(189 189 189 / 18%)",
        hard: " 0 0 5px rgba(23, 24, 24, 0.05), 0 1px 2px rgba(0, 0, 0, 0.14)"
    },
    fonts: {
        main: "Gilroy, -apple-system, system-ui, system-ui, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    },
    breakPoints: {
        xl: "1400px",
        lg: "1200px",
        md: "996px",
        sm: "768px",
        xs: "576px",
        xxs: "456px",
        xxxs: "356px",
    },
    contentSize: {
        wide: "1800px",
        standard: "1500px",
        tight: "1000px",
        extraTight: "900px"
    },
    borderRadius: "6px",
    transitions: {
        short: "all 200ms ease",
        standard: "all 500ms ease",
        long: "all 1000ms ease",

    }
}


export default theme;
