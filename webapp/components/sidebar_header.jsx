// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import React from 'react';

import Client from 'client/web_client.jsx';
import PreferenceStore from 'stores/preference_store.jsx';
import * as Utils from 'utils/utils.jsx';

import SidebarHeaderDropdown from './sidebar_header_dropdown.jsx';
import {Tooltip, OverlayTrigger} from 'react-bootstrap';

import {Preferences, TutorialSteps, Constants} from 'utils/constants.jsx';
import {createMenuTip} from 'components/tutorial/tutorial_tip.jsx';

export function changeCss(className, classValue) {
    let styleEl = document.querySelector('style[data-class="' + className + '"]');
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.setAttribute('data-class', className);

        // Append style element to head
        document.head.appendChild(styleEl);
    }

    // Grab style sheet
    const styleSheet = styleEl.sheet;
    const rules = styleSheet.cssRules || styleSheet.rules;
    const style = classValue.substr(0, classValue.indexOf(':'));
    const value = classValue.substr(classValue.indexOf(':') + 1);

    for (let i = 0; i < rules.length; i++) {
        if (rules[i].selectorText === className) {
            rules[i].style[style] = value;
            return;
        }
    }

    let mediaQuery = '';
    if (className.indexOf('@media') >= 0) {
        mediaQuery = '}';
    }
    styleSheet.insertRule(className + '{' + classValue + '}' + mediaQuery, styleSheet.cssRules.length);
}

export default class SidebarHeader extends React.Component {
    constructor(props) {
        super(props);

        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.onPreferenceChange = this.onPreferenceChange.bind(this);

        this.state = this.getStateFromStores();
    }

    componentDidMount() {
        PreferenceStore.addChangeListener(this.onPreferenceChange);
    }

    componentWillUnmount() {
        PreferenceStore.removeChangeListener(this.onPreferenceChange);
    }

    getStateFromStores() {
        const tutorialStep = PreferenceStore.getInt(Preferences.TUTORIAL_STEP, this.props.currentUser.id, 999);

        return {showTutorialTip: tutorialStep === TutorialSteps.MENU_POPOVER && !Utils.isMobile()};
    }

    onPreferenceChange() {
        this.setState(this.getStateFromStores());
    }

    toggleDropdown(e) {
        e.preventDefault();

        this.refs.dropdown.toggleDropdown();
    }

    render() {
        var me = this.props.currentUser;
        var profilePicture = null;

        if (!me) {
            return null;
        }

        if (me.last_picture_update) {
            profilePicture = (
                <img
                    className='user__picture'
                    src={Client.getUsersRoute() + '/' + me.id + '/image?time=' + me.last_picture_update}
                />
            );
        }

        let tutorialTip = null;
        if (this.state.showTutorialTip) {
            tutorialTip = createMenuTip(this.toggleDropdown);
        }

        let teamNameWithToolTip = null;
        if (this.props.teamDescription === '') {
            teamNameWithToolTip = (
                <div className='team__name'>{this.props.teamDisplayName}</div>
            );
        } else {
            teamNameWithToolTip = ( 
                <OverlayTrigger
                    trigger={['hover', 'focus']}
                    delayShow={Constants.OVERLAY_TIME_DELAY}
                    placement='bottom'
                    overlay={<Tooltip id='team-name__tooltip'>{this.props.teamDescription}</Tooltip>}
                    ref='descriptionOverlay'
                >
                    <div className='team__name'>{this.props.teamDisplayName}</div>
                </OverlayTrigger>
            );
        }
				
				var username = this.props.currentUser.username;
				if(username.includes("guest")) {
					//alert('i think you may be a guest');
					 changeCss('.ps-container','display:none!important;');
					 changeCss('.sidebar--left','width:0px!important;');
					 changeCss('.channel-header.alt','display:none!important;');
					 changeCss('.app__content','margin-left:0px!important;');
				} // end if
					

				//Kerauno Chat - Removed Team Header
        return (
					<span></span>
        );
    }
}

SidebarHeader.defaultProps = {
    teamDisplayName: '',
    teamDescription: '',
    teamType: ''
};
SidebarHeader.propTypes = {
    teamDisplayName: React.PropTypes.string,
    teamDescription: React.PropTypes.string,
    teamName: React.PropTypes.string,
    teamType: React.PropTypes.string,
    currentUser: React.PropTypes.object
};
