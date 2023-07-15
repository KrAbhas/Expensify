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
// import * as Task from '../../libs/actions/Task';
import CONST from '../../CONST';
// import TextInput from '../../components/TextInput';
// import styles from '../../styles/styles';
// import reportPropTypes from '../reportPropTypes';
// import compose from '../../libs/compose';
// import * as Task from '../../libs/actions/Task';
// import CONST from '../../CONST';

// const propTypes = {
//     /** The report currently being looked at */
//     report: reportPropTypes,

//     /** Current user session */
//     session: PropTypes.shape({kjhkjhjji
//         email: PropTypes.string.isRequired,
//     }),

//     /* Onyx Props */
//     ...withLocalizePropTypes,
// };

// const defaultProps = {
//     session: {},
//     report: {},
// };

export default function VoluteerReferralPage(props) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [contactEmailOrPhone, setContactEmailOrPhone] = useState('');

    console.log("On volunteer referral");
    return (
        <ScreenWrapper
            onEntryTransitionEnd={() => inputRef.current && inputRef.current.focus()}
            includeSafeAreaPaddingBottom={false}
        >
            <HeaderWithBackButton
                title={"I know a teacher"}
                // onCloseButtonPress={() => Task.dismissModalAndClearOutTaskInfo()}
                shouldShowBackButton
                // onBackButtonPress={() => Task.dismissModalAndClearOutTaskInfo()}
            />
            <Form
                // formID={ONYXKEYS.FORMS.NEW_TASK_FORM} //Change from backend(We neeed a new key)
                submitButtonText={"Let's do this"}
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
                        inputID="firstName"
                        label={"First Name"}
                        // accessibilityLabel={props.translate('common.firstName')}
                        value={firstName}
                        onValueChange={(value) => setFirstName(value)}
                    />
                </View>
                <View style={styles.mb5}>
                    <TextInput
                        ref={(el) => {}}
                        // accessibilityRole={CONST.ACCESSIBILITY_ROLE.TEXT}
                        inputID="lastName"
                        label="Last Name"
                        // accessibilityLabel={props.translate('common.lastName')}
                        value={lastName}
                        onValueChange={(value) => setLastName(value)}
                    />
                </View>
                <View style={styles.mb5}>
                    <TextInput
                        inputID="emailOrPhone"
                        autoCapitalize="none"
                        autoCorrect={false}
                        label={"Email or phone number"}
                        // accessibilityLabel={"Email or phone number"}
                        // accessibilityRole={CONST.ACCESSIBILITY_ROLE.TEXT}
                        // containerStyles={[styles.mt5]}
                        // textAlignVertical="top"
                        value={contactEmailOrPhone}
                        onValueChange={(value) => setContactEmailOrPhone(value)}
                        submitOnEnter
                        // keyboardType={Str.isValidEmail(contactEmailOrPhone) ? CONST.KEYBOARD_TYPE.EMAIL_ADDRESS : CONST.KEYBOARD_TYPE.DEFAULT} //from close account page, setting/security/. L113
                    />
                </View>
            </Form>
        </ScreenWrapper>
    );
}

// TaskTitlePage.propTypes = propTypes;
// TaskTitlePage.defaultProps = defaultProps;

// export default compose(
//     withLocalize,
//     withOnyx({
//         session: {
//             key: ONYXKEYS.SESSION,
//         },
//         report: {
//             key: ({route}) => `${ONYXKEYS.COLLECTION.REPORT}${route.params.reportID}`,
//         },
//     }),
// )(VolunteerReferralPage);
