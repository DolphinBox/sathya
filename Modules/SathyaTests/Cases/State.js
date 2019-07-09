async function testSathyaState(ServerState, log) {
    // Admittedly this test is somewhat redundant...
    // If the state is broken the server wouldn't be able to boot this far.

    let result = {
        SetGetSingleLevel: true,
        SetGetMultiLevel: true
    };

    let testString = "Tests are cool!";
    log.info('  -> SetState and GetState - Single Level');
    await ServerState.setState({
       SathyaTest: testString
    });
    let valueInState = ServerState.getState().SathyaTest;
    if(valueInState === testString) {
        log.info('    -> PASSED');
    } else {
        log.info('    -> FAILED');
        result.SetGetSingleLevel = false;
    }

    /* -- Multi Level Set/Get State -- */
    let firstTestString = "Tests are cool!";
    let secondTestString = "This is yet another string!";
    let thirdTestString = "Even more fun!";
    let modifiedThirdTestString = "Did I change?";
    log.info('  -> SetState and GetState - Multi Level Modification');
    await ServerState.setState({
        SathyaTest2: {
            String1: firstTestString,
            MoreStrings: {
                String2: secondTestString,
                String3: thirdTestString
            }
        }
    });
    // Change a string multiple levels down
    await ServerState.setState({
        SathyaTest2: {
            MoreStrings: {
                String3: modifiedThirdTestString
            }
        }
    });

    let Test2Object = ServerState.getState().SathyaTest2;
    if(Test2Object.String1 === firstTestString) {
        log.info('    -> 1 PASSED');
    } else {
        log.info('    -> 1 FAILED');
        result.SetGetMultiLevel = false;
    }
    if(Test2Object.MoreStrings.String2 === secondTestString) {
        log.info('    -> 2 PASSED');
    } else {
        log.info('    -> 2 FAILED');
        result.SetGetMultiLevel = false;
    }
    if(Test2Object.MoreStrings.String3 === modifiedThirdTestString) {
        log.info('    -> 3 PASSED');
    } else {
        log.info('    -> 3 FAILED');
        result.SetGetMultiLevel = false;
    }

    return result;
}

module.exports = testSathyaState;