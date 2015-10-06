"use strict";

class Categories extends React.Component{
    componentWillMount(){
        this.setState({
            categories: []
        })
    }
    componentDidMount() {
        $.get(this.props.apiCategoryUrl, function(response) {
            this.setState({
                categories: response
            })
        }.bind(this));
    }
    render() {
        var rows = [];
        this.state.categories.forEach(function(category) {
            rows.push(<li><Link link={category} key={category.id} /></li>);
        });
        return (
            <ul>{rows}</ul>
        )
    }
}