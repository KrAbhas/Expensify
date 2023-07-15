import React, {useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import {withOnyx} from 'react-native-onyx';
import PropTypes from 'prop-types';
import withLocalize, {withLocalizePropTypes} from '../../components/withLocalize';
import compose from '../../libs/compose';
import HeaderWithBackButton from '../../components/HeaderWithBackButton';
import Navigation from '../../libs/Navigation/Navigation';
import ScreenWrapper from '../../components/ScreenWrapper';
import styles from '../../styles/styles';
import ONYXKEYS from '../../ONYXKEYS';
import * as ErrorUtils from '../../libs/ErrorUtils';
import Form from '../../components/Form';
import TextInput from '../../components/TextInput';
import Permissions from '../../libs/Permissions';
import ROUTES from '../../ROUTES';
import CONST from '../../CONST';
import Text from '../../components/Text'

export default function VolunteerSignupPage(props) {
    const [principalfirstName, setprincipalFirstName] = useState('');
    const [principallastName, setprincipalLastName] = useState('');
    const [principalWorkEmail, setPrincipalWorkEmail] = useState('');

    return (
        <ScreenWrapper
            onEntryTransitionEnd={() => inputRef.current && inputRef.current.focus()}
            includeSafeAreaPaddingBottom={false}
        >
            <HeaderWithBackButton
                title={"Intro to your principal"}
                // onCloseButtonPress={() => Task.dismissModalAndClearOutTaskInfo()}
                shouldShowBackButton
                // onBackButtonPress={() => Task.dismissModalAndClearOutTaskInfo()}
            />
            <View style={[styles.pageWrapper, styles.alignItemsCenter]}> 
                <Text style={[styles.baseFontStyle]}>Expensify.org splits the cost of essential school supplies so that students from low-imcome households can have a better learning experience. Your principal will be asked to verify your expenses.</Text>
            </View>
            <Form
                // formID={ONYXKEYS.FORMS.NEW_TASK_FORM} //Change from backend(We neeed a new key)
                submitButtonText={"Let's start"}
                style={[styles.mh5, styles.flexGrow1]}
                // validate={(values) => validate(values)}
                // onSubmit={(values) => onSubmit(values)}
                validate={() => {}}
                onSubmit={() => {}}
                enabledWhenOffline
            >
                <View style={styles.mb5}>
                    <TextInput
                        ref={(el) => {}}
                        // accessibilityRole={CONST.ACCESSIBILITY_ROLE.TEXT}
                        inputID="principalfirstName"
                        label={"Principal First Name"}
                        // accessibilityLabel={props.translate('common.firstName')}
                        value={principalfirstName}
                        onValueChange={(value) => setprincipalFirstName(value)}
                    />
                </View>
                <View style={styles.mb5}>
                    <TextInput
                        ref={(el) => {}}
                        // accessibilityRole={CONST.ACCESSIBILITY_ROLE.TEXT}
                        inputID="principal lastName"
                        label="Principal Last Name"
                        // accessibilityLabel={props.translate('common.lastName')}
                        value={principallastName}
                        onValueChange={(value) => setprincipalLastName(value)}
                    />
                </View>
                <View style={styles.mb5}>
                    <TextInput
                        inputID="principalworkemail"
                        autoCapitalize="none"
                        autoCorrect={false}
                        label={"Principal Work Email"}
                        // accessibilityLabel={"Email or phone number"}
                        // accessibilityRole={CONST.ACCESSIBILITY_ROLE.TEXT}
                        // containerStyles={[styles.mt5]}
                        // textAlignVertical="top"
                        value={principalWorkEmail}
                        onValueChange={(value) => setPrincipalWorkEmail(value)}
                        submitOnEnter
                        // keyboardType={Str.isValidEmail(contactEmailOrPhone) ? CONST.KEYBOARD_TYPE.EMAIL_ADDRESS : CONST.KEYBOARD_TYPE.DEFAULT} //from close account page, setting/security/. L113
                    />
                </View>
            </Form>
        </ScreenWrapper>
    );
}

