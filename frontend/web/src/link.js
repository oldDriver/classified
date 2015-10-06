"use strict";

class Link extends React.Component {
    render() {
        return (
            <a href={this.props.link.href}>{this.props.link.name}</a>
        )
    }
}