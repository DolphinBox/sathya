import React, { Component } from 'react';
import {
    Grommet,
    Box,
    Button,
    Heading,
    Collapsible,
    Layer,
    Grid
} from 'grommet';
import { SettingsOption } from 'grommet-icons';

import Lottie from 'react-lottie';
import animationData from './globe-spinner.json'

import {getState} from './API';

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


class LoadingScreen extends Component {
    render(props) {
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
                <Layer animate={false} style={{opacity: this.props.spinnerOpacity}}>
                    <Lottie options={defaultOptions}
                            height={400}
                            width={400}
                    />
                    <Heading level={4} style={{textAlign: 'center'}}>Loading...</Heading>
                </Layer>
            </Grommet>
        );
    }
}


class App extends Component {
    state = {
        showSidebar: false,
        showSpinner: true,
        spinnerOpacity: 1,
    };

    async fadeSpinner() {
        for(let i = 100; i > 0; i--) {
            await sleep(1);
            this.setState({spinnerOpacity: i / 50});
        }
        this.setState({showSpinner: false});
    }

    async componentDidMount() {
        let initState = await getState();
        this.setState({serverState: initState.data});
        setTimeout(async () => {
            this.fadeSpinner();
        }, 100);
    }

    render() {
        const { showSidebar } = this.state;

        // Wait for data to populate. When this switches to the main
        // render, the loader will still be displayed until it's faded out.
        if(typeof this.state.serverState == 'undefined')
            return (
                <LoadingScreen spinnerOpacity={this.state.spinnerOpacity}/>
            );
        // Everything that executes after this is when the serverState is initially loaded.

        let moduleListJSX = [];
        for(let i = 0; i < this.state.serverState.moduleList.length; i++) {
            moduleListJSX[i] = <li>{this.state.serverState.moduleList[i]}</li>
        }
        return (
            <Grommet theme={theme} full>
                { this.state.showSpinner && <LoadingScreen spinnerOpacity={this.state.spinnerOpacity}/> }
                <Box fill>
                    <AppBar>
                        <Heading level='3' margin='none'>SathyaServer</Heading>
                        <Button
                            icon={<SettingsOption />}
                            onClick={() => this.setState(prevState => ({ showSidebar: !prevState.showSidebar }))}
                        />
                    </AppBar>

                    <Box direction='row' flex overflow={{ horizontal: 'hidden' }}>
                        <Box flex align='stretch' justify='stretch'>
                            <Grid
                                rows={['flex', 'flex']}
                                columns={['flex', 'flex']}
                                gap="small"
                                areas={[
                                    { name: 'a1', start: [0, 0], end: [0, 0] },
                                    { name: 'a2', start: [1, 0], end: [1, 0] },
                                    { name: 'a34', start: [0, 1], end: [1, 1] },
                                ]}
                                margin="small"
                                fill
                            >
                                <Box gridArea="a1" background="light-2" fill pad="medium">
                                    <Heading level="2" margin="none">System Info</Heading>
                                    <Box direction='row' flex overflow={{ horizontal: 'hidden' }}>
                                        <Box flex align='stretch' justify='stretch'>
                                            <p>CPU: {this.state.serverState.systemInfo.cpu}</p>
                                            <p>Base OS: {this.state.serverState.systemInfo.os}</p>
                                            <p>Runtime: {this.state.serverState.systemInfo.runtime}</p>
                                        </Box>
                                        <Box flex align='stretch' justify='stretch'>
                                            <p>CPU Usage: {}</p>
                                            <p>RAM Usage: {}</p>
                                            <p>Uptime: {}</p>
                                        </Box>
                                    </Box>

                                </Box>
                                <Box gridArea="a2" background="light-3" fill pad="medium">
                                    <Heading level="2" margin="none">Loaded Modules</Heading>
                                    <ul>
                                        {moduleListJSX}
                                    </ul>
                                </Box>
                                <Box gridArea="a34" background="light-4" fill>

                                <Box gridArea="a34" background="light-4" fill pad="medium">
                                    <Heading level="2" margin="none">Actions</Heading>

                                </Box>
                            </Grid>
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
