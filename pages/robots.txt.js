import { Component } from "react";

export default class Robots extends Component {
    static getInitialProps({ res }) {
        res.setHeader("Content-Type", "text/plain");
        res.write(`User-agent: *
        Disallow: /`);
        res.end();
    }
}