import React, { Component } from 'react';
import {
    Grommet,
    Box,
    Button,
    Heading,
    Collapsible,
    Layer
} from 'grommet';
import { SettingsOption } from 'grommet-icons';

import Lottie from 'react-lottie';
import animationData from './globe-spinner.json'

import {callAPI} from './API';

const AppBar = (props) => (
    <Box
        tag='header'
        direction='row'
        align='center'
        justify='between'
        background='brand'
        pad={{ left: 'medium', right: 'small', vertical: 'small' }}
        elevation='medium'
        style={{ zIndex: '1' }}
        {...props}
    />
);

// "Sleep" for JS (using await)
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
};

class App extends Component {
    state = {
        showSidebar: false,
        showSpinner: true,
        spinnerOpacity: 1,
        testText: "Loading State..."
    };

    async fadeSpinner() {
        for(let i = 100; i > 0; i--) {
            await sleep(1);
            this.setState({spinnerOpacity: i / 100});
        }
        this.setState({showSpinner: false});
    }

    async componentDidMount() {
        setTimeout(async () => {
            this.fadeSpinner();
        }, 2000);
        let initState = await callAPI();
        this.setState({testText: initState.data});
    }

    render() {
        const { showSidebar } = this.state;
        const defaultOptions = {
            loop: true,
            autoplay: true,
            animationData: animationData,
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
            }
        };

        return (
            <Grommet theme={theme} full>
                <Box fill>
                    <AppBar>
                        <Heading level='3' margin='none'>SathyaServer</Heading>
                        <Button
                            icon={<SettingsOption />}
                            onClick={() => this.setState(prevState => ({ showSidebar: !prevState.showSidebar }))}
                        />
                    </AppBar>
                    {this.state.showSpinner && (
                        <Layer style={{opacity: this.state.spinnerOpacity}}>
                            <Lottie options={defaultOptions}
                                    height={400}
                                    width={400}
                            />
                            <Heading level={4} style={{textAlign: 'center'}}>Loading...</Heading>
                        </Layer>
                    )}

                    <Box direction='row' flex overflow={{ horizontal: 'hidden' }}>
                        <Box flex align='center' justify='center'>
                            <p>{JSON.stringify(this.state.testText)}</p>
                        </Box>
                        <Collapsible direction="horizontal" open={showSidebar}>
                            <Box
                                flex
                                width='medium'
                                background='light-2'
                                elevation='small'
                                align='center'
                                justify='center'
                            >
                                sidebar
                            </Box>
                        </Collapsible>
                    </Box>
                </Box>
            </Grommet>
        );
    }

}

const theme = {
    global: {
        colors: {
            brand: '#228BE6',
        },
        font: {
            family: 'Ubuntu',
            size: '20px',
            height: '20px',
        },
    },
    layer: {
        background: '#616161',
        overlay : {
            background: 'rgba(255, 255, 255, 1)'
        }
    }
};

export default App;
