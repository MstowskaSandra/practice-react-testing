import React from 'react';
class CatchError extends React.Component {
    state = { hasError: false }
    static getDerivedStateFromError(error) {
        return { hasError: true };
    }
    
    render() {
        if(this.state.hasError) {
            return <h1>Błąd: coś poszło nie tak...</h1>
        }
        return this.props.children;
    }
}
export default CatchError;