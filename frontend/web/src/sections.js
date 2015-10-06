"use strict";

class Sections extends React.Component{
    componentWillMount(){
        this.setState({
            sections: []
        })
    }
    componentDidMount() {
        $.get(this.props.apiSectionUrl, function(response) {
            this.setState({
                sections: response
            })
        }.bind(this));
    }
    render() {
        var rows = [];
        this.state.sections.forEach(function(section) {
            rows.push(<li><Link link={section} key={section.id} /></li>);
        });
        return (
            <ul>{rows}</ul>
        )
    }
}