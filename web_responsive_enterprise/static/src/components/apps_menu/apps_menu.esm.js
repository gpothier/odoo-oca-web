/** @odoo-module **/
/* Copyright 2023 gpothier
 * License LGPL-3.0 or later (http://www.gnu.org/licenses/lgpl). */

import {NavBar} from "@web/webclient/navbar/navbar";
import {useService} from "@web/core/utils/hooks";
import {WebClient} from "@web/webclient/webclient";
import {patch} from "@web/core/utils/patch";
import {WebClientEnterprise} from "@web_enterprise/webclient/webclient";
import {AppsMenu} from "@web_responsive/components/apps_menu/apps_menu.esm";

// Restore original NavBar component
Object.assign(WebClientEnterprise.components, {NavBar});

// Do not show enterprise's home menu (restoring original WebClient behavior)
patch(WebClientEnterprise.prototype, "web_responsive_enterprise._loadDefaultApp", {
    _loadDefaultApp() {
        return WebClient.prototype._loadDefaultApp.apply(this);
    },
});

// Show apps menu instead of initial app when page loads
patch(AppsMenu.prototype, "web_responsive_enterprise._getInitialOpenState", {
    setup() {
        this.router = useService("router");
        this._super();
    },
    _getInitialOpenState() {
        // Open apps menu on startup if no action is specified in the URL
        const {hash} = this.router.current;
        return hash.action === undefined;
    },
});