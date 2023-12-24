import React, {useCallback, useMemo, useState} from 'react';
import {View} from 'react-native';
import {withOnyx} from 'react-native-onyx';
import _ from 'underscore';
import GoogleMeetIcon from '@assets/images/google-meet.svg';
import ZoomIcon from '@assets/images/zoom-icon.svg';
import useLocalize from '@hooks/useLocalize';
import useThemeStyles from '@hooks/useThemeStyles';
import useWindowDimensions from '@hooks/useWindowDimensions';
import compose from '@libs/compose';
import * as CurrencyUtils from '@libs/CurrencyUtils';
import * as HeaderUtils from '@libs/HeaderUtils';
import Navigation from '@libs/Navigation/Navigation';
import * as ReportUtils from '@libs/ReportUtils';
import * as IOU from '@userActions/IOU';
import * as Link from '@userActions/Link';
import * as UserSession from '@userActions/Session';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import ROUTES from '@src/ROUTES';
import Button from './Button';
import ConfirmModal from './ConfirmModal';
import HeaderWithBackButton from './HeaderWithBackButton';
import * as Expensicons from './Icon/Expensicons';
import MoneyReportHeaderStatusBar from './MoneyReportHeaderStatusBar';
import SettlementButton from './SettlementButton';
import withWindowDimensions from './withWindowDimensions';
import type {PersonalDetails, Policy, Report, ReportNextStep, Session} from '@src/types/onyx';
import type {WindowDimensionsProps} from './withWindowDimensions/types';

type MoneyReportHeaderProps = WindowDimensionsProps & {
    /** The report currently being looked at */
    report: Report;

    /** The policy tied to the money request report */
    policy: Policy;

    /** The chat report this report is linked to */
    chatReport: Report;

    /** The next step for the report */
    nextStep: ReportNextStep;

    /** Personal details so we can get the ones for the report participants */
    personalDetails: PersonalDetails

    /** UserSession info for the currently logged in user. */
    session: Session;
};

function MoneyReportHeader({session, personalDetails, policy, chatReport, nextStep, report: moneyRequestReport, isSmallScreenWidth}: MoneyReportHeaderProps) {
    const {windowWidth} = useWindowDimensions();
    const styles = useThemeStyles();
    const {translate} = useLocalize();
    const reimbursableTotal = ReportUtils.getMoneyRequestReimbursableTotal(moneyRequestReport);
    const isApproved = ReportUtils.isReportApproved(moneyRequestReport);
    const isSettled = ReportUtils.isSettled(moneyRequestReport.reportID);
    const policyType = policy?.type;
    const isPolicyAdmin = policyType !== CONST.POLICY.TYPE.PERSONAL && policy?.role === CONST.POLICY.ROLE.ADMIN;
    const isGroupPolicy = _.contains([CONST.POLICY.TYPE.CORPORATE, CONST.POLICY.TYPE.TEAM], policyType);
    const isManager = ReportUtils.isMoneyRequestReport(moneyRequestReport) && session?.accountID === moneyRequestReport.managerID;
    const isPayer = isGroupPolicy
        ? // In a group policy, the admin approver can pay the report directly by skipping the approval step
          isPolicyAdmin && (isApproved || isManager)
        : isPolicyAdmin || (ReportUtils.isMoneyRequestReport(moneyRequestReport) && isManager);
    const isDraft = ReportUtils.isDraftExpenseReport(moneyRequestReport);
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

    const cancelPayment = useCallback(() => {
        IOU.cancelPayment(moneyRequestReport, chatReport);
        setIsConfirmModalVisible(false);
    }, [moneyRequestReport, chatReport]);

    const shouldShowPayButton = useMemo(
        () => isPayer && !isDraft && !isSettled && !moneyRequestReport.isWaitingOnBankAccount && reimbursableTotal !== 0 && !ReportUtils.isArchivedRoom(chatReport),
        [isPayer, isDraft, isSettled, moneyRequestReport, reimbursableTotal, chatReport],
    );
    const shouldShowApproveButton = useMemo(() => {
        if (!isGroupPolicy) {
            return false;
        }
        return isManager && !isDraft && !isApproved && !isSettled;
    }, [isGroupPolicy, isManager, isDraft, isApproved, isSettled]);
    const shouldShowSettlementButton = shouldShowPayButton || shouldShowApproveButton;
    const shouldShowSubmitButton = isDraft && reimbursableTotal !== 0;
    const isFromPaidPolicy = policyType === CONST.POLICY.TYPE.TEAM || policyType === CONST.POLICY.TYPE.CORPORATE;
    const shouldShowNextSteps = isFromPaidPolicy && nextStep && !_.isEmpty(nextStep.message);
    const shouldShowAnyButton = shouldShowSettlementButton || shouldShowApproveButton || shouldShowSubmitButton || shouldShowNextSteps;
    const bankAccountRoute = ReportUtils.getBankAccountRoute(chatReport);
    const formattedAmount = CurrencyUtils.convertToDisplayString(reimbursableTotal, moneyRequestReport.currency);
    const isMoreContentShown = shouldShowNextSteps || (shouldShowAnyButton && isSmallScreenWidth);

    const threeDotsMenuItems = [HeaderUtils.getPinMenuItem(moneyRequestReport)];
    if (isPayer && isSettled) {
        threeDotsMenuItems.push({
            icon: Expensicons.Trashcan,
            text: 'Cancel payment',
            onSelected: () => setIsConfirmModalVisible(true),
        });
    }
    if (!ReportUtils.isArchivedRoom(chatReport)) {
        threeDotsMenuItems.push({
            icon: ZoomIcon,
            text: translate('videoChatButtonAndMenu.zoom'),
            onSelected: UserSession.checkIfActionIsAllowed(() => {
                Link.openExternalLink(CONST.NEW_ZOOM_MEETING_URL);
            }),
        });
        threeDotsMenuItems.push({
            icon: GoogleMeetIcon,
            text: translate('videoChatButtonAndMenu.googleMeet'),
            onSelected: UserSession.checkIfActionIsAllowed(() => {
                Link.openExternalLink(CONST.NEW_GOOGLE_MEET_MEETING_URL);
            }),
        });
    }

    return (
        <View style={[styles.pt0]}>
            <HeaderWithBackButton
                shouldShowAvatarWithDisplay
                shouldEnableDetailPageNavigation
                shouldShowPinButton={false}
                report={moneyRequestReport}
                policy={policy}
                personalDetails={personalDetails}
                shouldShowBackButton={isSmallScreenWidth}
                onBackButtonPress={() => Navigation.goBack(ROUTES.HOME, false, true)}
                // Shows border if no buttons or next steps are showing below the header
                shouldShowBorderBottom={!(shouldShowAnyButton && isSmallScreenWidth) && !(shouldShowNextSteps && !isSmallScreenWidth)}
                shouldShowThreeDotsButton
                threeDotsMenuItems={threeDotsMenuItems}
                threeDotsAnchorPosition={styles.threeDotsPopoverOffsetNoCloseButton(windowWidth)}
            >
                {shouldShowSettlementButton && !isSmallScreenWidth && (
                    <View style={styles.pv2}>
                        <SettlementButton
                            currency={moneyRequestReport.currency}
                            policyID={moneyRequestReport.policyID}
                            chatReportID={chatReport.reportID}
                            iouReport={moneyRequestReport}
                            onPress={(paymentType) => IOU.payMoneyRequest(paymentType, chatReport, moneyRequestReport)}
                            enablePaymentsRoute={ROUTES.ENABLE_PAYMENTS}
                            addBankAccountRoute={bankAccountRoute}
                            shouldHidePaymentOptions={!shouldShowPayButton}
                            shouldShowApproveButton={shouldShowApproveButton}
                            style={[styles.pv2]}
                            formattedAmount={formattedAmount}
                        />
                    </View>
                )}
                {shouldShowSubmitButton && !isSmallScreenWidth && (
                    <View style={styles.pv2}>
                        <Button
                            medium
                            success={chatReport.isOwnPolicyExpenseChat}
                            text={translate('common.submit')}
                            style={[styles.mnw120, styles.pv2, styles.pr0]}
                            onPress={() => IOU.submitReport(moneyRequestReport)}
                        />
                    </View>
                )}
            </HeaderWithBackButton>
            <View style={isMoreContentShown ? [styles.dFlex, styles.flexColumn, styles.borderBottom] : []}>
                {shouldShowSettlementButton && isSmallScreenWidth && (
                    <View style={[styles.ph5, styles.pb2]}>
                        <SettlementButton
                            currency={moneyRequestReport.currency}
                            policyID={moneyRequestReport.policyID}
                            chatReportID={moneyRequestReport.chatReportID}
                            iouReport={moneyRequestReport}
                            onPress={(paymentType) => IOU.payMoneyRequest(paymentType, chatReport, moneyRequestReport)}
                            enablePaymentsRoute={ROUTES.ENABLE_PAYMENTS}
                            addBankAccountRoute={bankAccountRoute}
                            shouldHidePaymentOptions={!shouldShowPayButton}
                            shouldShowApproveButton={shouldShowApproveButton}
                            formattedAmount={formattedAmount}
                        />
                    </View>
                )}
                {shouldShowSubmitButton && isSmallScreenWidth && (
                    <View style={[styles.ph5, styles.pb2]}>
                        <Button
                            medium
                            success={chatReport.isOwnPolicyExpenseChat}
                            text={translate('common.submit')}
                            style={[styles.w100, styles.pr0]}
                            onPress={() => IOU.submitReport(moneyRequestReport)}
                        />
                    </View>
                )}
                {shouldShowNextSteps && (
                    <View style={[styles.ph5, styles.pb3]}>
                        <MoneyReportHeaderStatusBar nextStep={nextStep} />
                    </View>
                )}
            </View>
            <ConfirmModal
                title={translate('iou.cancelPayment')}
                isVisible={isConfirmModalVisible}
                onConfirm={cancelPayment}
                onCancel={() => setIsConfirmModalVisible(false)}
                prompt={translate('iou.cancelPaymentConfirmation')}
                confirmText={translate('iou.cancelPayment')}
                cancelText={translate('common.dismiss')}
                danger
            />
        </View>
    );
}

MoneyReportHeader.displayName = 'MoneyReportHeader';

export default compose(
    withWindowDimensions,
    withOnyx({
        chatReport: {
            key: ({report}) => `${ONYXKEYS.COLLECTION.REPORT}${report.chatReportID}`,
        },
        nextStep: {
            key: ({report}) => `${ONYXKEYS.COLLECTION.NEXT_STEP}${report.reportID}`,
        },
        session: {
            key: ONYXKEYS.SESSION,
        },
    }),
)(MoneyReportHeader);
