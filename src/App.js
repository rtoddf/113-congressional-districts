import React from 'react';
import CongressionalDistricts from './CongressionalDistricts';

class App extends React.Component {
    render() {
        return (
            <div>
                <svg width="960" height="600">
                    <CongressionalDistricts width={960} height={600} />
                </svg>
            </div>
        )
    }
}

export default App;