import _ from 'underscore';
import React from 'react';
import {View, ScrollView} from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import HeaderWithBackButton from '../../components/HeaderWithBackButton';
import MenuItem from '../../components/MenuItem';
import ROUTES from '../../ROUTES';
import NAVIGATION from '../../libs/Navigation/Navigation';
import * as Expensicons from '../../components/Icon/Expensicons';

export default function NewTeachersUnitePage(props) {
    console.log("Save the world");
    const item = {
            translationKey: 'initialSettingsPage.aboutPage.appDownloadLinks',
            action: () => {},
        }
    return (
        <ScreenWrapper
            includeSafeAreaPaddingBottom={false}
            shouldEnableMaxHeight
        >
            {({safeAreaPaddingBottomStyle}) => (
                <>
                    <HeaderWithBackButton
                        title="Save The World"
                    />
                    <ScrollView>
                        <MenuItem
                            key={"item1"}
                            title={"I know a teacher"}
                            iconRight={item.iconRight}
                            onPress={() => {NAVIGATION.navigate(ROUTES.VOLUNTEER_REFERRAL)}}
                            shouldBlockSelection={Boolean(item.link)}
                            ref={(el) => {}}
                            shouldShowRightIcon
                        />
                        <MenuItem
                            key={"item2"}
                            title={"I am a teacher"}
                            iconRight={item.iconRight}
                            onPress={() => {NAVIGATION.navigate(ROUTES.VOLUNTEER_SIGNUP)}}
                            shouldBlockSelection={Boolean(item.link)}
                            ref={(el) => {}}
                            shouldShowRightIcon
                        />
                    </ScrollView>
                </>
            )}
        </ScreenWrapper>
    );
}

//restart sever