function buildCompSettingsPanel( container ) {

    var sizeGroup = DuScriptUI.group( container, 'row');

    var sizeOptionsGroup = DuScriptUI.group( sizeGroup, 'column');

    var sizeSettingsButton = DuScriptUI.button( sizeOptionsGroup, {
        text: '',
        helpTip: i18n._("Adjust other parameters for setting the size."),
        image: DuScriptUI.Icon.OPTIONS
    });
    sizeSettingsButton.alignment = ['center', 'top'];

    var sizeAnchorPopup = DuScriptUI.popUp( i18n._("Resize settings") );
    sizeAnchorPopup.anchor = DuMath.Location.CENTER;
    sizeAnchorPopup.build = function() {

        function uncheckAll() {
            tlButton.setChecked( false );
            lButton.setChecked( false );
            blButton.setChecked( false );
            tButton.setChecked( false );
            cButton.setChecked( false );
            bButton.setChecked( false );
            trButton.setChecked( false );
            rButton.setChecked( false );
            brButton.setChecked( false );
        }
        
        var gridGroup = DuScriptUI.group(sizeAnchorPopup.content, 'row');
        gridGroup.alignment = ['center', 'top'];
        var column1 = DuScriptUI.group(gridGroup, 'column');
        var column2 = DuScriptUI.group(gridGroup, 'column');
        var column3 = DuScriptUI.group(gridGroup, 'column');

        var tlButton = DuScriptUI.checkBox(
            column1,
            '',
            w12_move_tl
        );
        tlButton.onClick = function() {
            uncheckAll();
            tlButton.setChecked(true);
            sizeAnchorPopup.anchor = DuMath.Location.TOP_LEFT;
        };
        var lButton = DuScriptUI.checkBox(
            column1,
            '',
            w12_move_l
        );
        lButton.onClick = function() {
            uncheckAll();
            lButton.setChecked(true);
            sizeAnchorPopup.anchor = DuMath.Location.LEFT;
        };
        var blButton = DuScriptUI.checkBox(
            column1,
            '',
            w12_move_bl
        );
        blButton.onClick = function() {
            uncheckAll();
            blButton.setChecked(true);
            sizeAnchorPopup.anchor = DuMath.Location.BOTTOM_LEFT;
        };

        var tButton = DuScriptUI.checkBox(
            column2,
            '',
            w12_move_t
        );
        tButton.onClick = function() {
            uncheckAll();
            tButton.setChecked(true);
            sizeAnchorPopup.anchor = DuMath.Location.TOP;
        };
        var cButton = DuScriptUI.checkBox(
            column2,
            '',
            w12_center
        );
        cButton.onClick = function() {
            uncheckAll();
            cButton.setChecked(true);
            sizeAnchorPopup.anchor = DuMath.Location.CENTER;
        };
        var bButton = DuScriptUI.checkBox(
            column2,
            '',
            w12_move_b
        );
        bButton.onClick = function() {
            uncheckAll();
            bButton.setChecked(true);
            sizeAnchorPopup.anchor = DuMath.Location.BOTTOM;
        };

        var trButton = DuScriptUI.checkBox(
            column3,
            '',
            w12_move_tr
        );
        trButton.onClick = function() {
            uncheckAll();
            trButton.setChecked(true);
            sizeAnchorPopup.anchor = DuMath.Location.TOP_RIGHT;
        };
        var rButton = DuScriptUI.checkBox(
            column3,
            '',
            w12_move_r
        );
        rButton.onClick = function() {
            uncheckAll();
            rButton.setChecked(true);
            sizeAnchorPopup.anchor = DuMath.Location.RIGHT;
        };
        var brButton = DuScriptUI.checkBox(
            column3,
            '',
            w12_move_br
        );
        brButton.onClick = function() {
            uncheckAll();
            brButton.setChecked(true);
            sizeAnchorPopup.anchor = DuMath.Location.BOTTOM_RIGHT;
        };

        cButton.setChecked(true);
    };
    sizeAnchorPopup.tieTo(sizeSettingsButton);

    var sizeLinkButton =  DuScriptUI.checkBox( sizeOptionsGroup, {
        text: '',
        helpTip: i18n._("Constraint the dimensions together."),
        image: w12_constraints,
        imageChecked: w12_unlink_chain
    });
    sizeLinkButton.alignment = ['left', 'center'];

    var sizeValuesGroup = DuScriptUI.group( sizeGroup, 'column');

    var widthGroup = addSetting(sizeValuesGroup, i18n._("Width"));
    widthGroup.onClick = function() {
        if (heightGroup.checked) return;
        var comp = DuAEProject.getSelectedComp();
        if (!comp) return;
        widthEdit.setText(comp.width);
        heightEdit.setText(comp.height);
    };
    var widthEdit = DuScriptUI.editText( widthGroup, {
        text: '1920',
        suffix: " px"
    });
    widthEdit.onChange = function() {
        if (sizeLinkButton.checked) return;

        var width = parseInt(widthEdit.text);
        if ( isNaN(width) ) return;
        var prevWidth = parseInt( widthEdit.previousText );
        if ( isNaN(prevWidth) ) return;
        if (prevWidth == 0) return;

        var height = parseInt(heightEdit.text);
        if ( isNaN(height) ) return;      

        heightEdit.freeze = true;

        height = width * height / prevWidth;
        heightEdit.setText( Math.round(height) );

        heightEdit.freeze = false;
    };

    var heightGroup = addSetting(sizeValuesGroup, i18n._("Height"));
    heightGroup.onClick = function() {
        if (widthGroup.checked) return;
        var comp = DuAEProject.getSelectedComp();
        if (!comp) return;
        heightEdit.setText(comp.height);
        widthEdit.setText(comp.width);
    };
    var heightEdit = DuScriptUI.editText( heightGroup, {
        text: '1080',
        suffix: " px"
    });
    heightEdit.onChange = function() {
        if (sizeLinkButton.checked) return;

        var height = parseInt(heightEdit.text);
        if ( isNaN(height) ) return;
        var prevHeight = parseInt( heightEdit.previousText );
        if ( isNaN(prevHeight) ) return;
        if (prevHeight == 0) return;

        var width = parseInt(widthEdit.text);
        if ( isNaN(width) ) return;

        widthEdit.freeze = true;

        width = height * width / prevHeight;
        widthEdit.setText( Math.round(width) );

        widthEdit.freeze = false;
    };

    var parGroup = addSetting(container, i18n._("Pixel aspect"));
    var parEdit = DuScriptUI.selector( parGroup );
    parEdit.addButton( { text: i18n._("Square Pixels"), data: 1 } );
    parEdit.addButton( { text: i18n._("D1/DV NTSC (0.91)"), data: 0.91 } );
    parEdit.addButton( { text: i18n._("D1/DV NTSC Widescreen (1.21)"), data: 1.21 } );
    parEdit.addButton( { text: i18n._("D1/DV PAL (1.09)"), data: 1.09 } );
    parEdit.addButton( { text: i18n._("D1/DV PAL Widescreen (1.46)"), data: 1.46 } );
    parEdit.addButton( { text: i18n._("HDV 1080/DVCPRO HD 720 (1.33)"), data: 1.33 } );
    parEdit.addButton( { text: i18n._("DVCPRO HD 1080 (1.5)"), data: 1.5 } );
    parEdit.addButton( { text: i18n._("Anamorphic 2:1 (2)"), data: 2 } );//*/
    parEdit.setCurrentIndex(0);

    var frameRateGroup = addSetting(container, i18n._("Frame rate"));
    frameRateGroup.onClick = function() {
        var comp = DuAEProject.getSelectedComp();
        if (!comp) return;
        frameRateEdit.setText(comp.frameRate);
    };
    var frameRateEdit = DuScriptUI.editText( frameRateGroup, {
        text: '24.00',
        suffix: " fps"
    });

    var durationGroup = addSetting(container, i18n._("Duration"));
    durationGroup.onClick = function() {
        var comp = DuAEProject.getSelectedComp();
        if (!comp) return;
        durationEdit.setText( timeToCurrentFormat( comp.duration, comp.frameRate, true ));
    };
    var durationEdit = DuScriptUI.editText( durationGroup, {
        text: '00:00:00:00'
    });

    DuScriptUI.separator( container, uiMode <= 1 ? i18n._("Display") : '' );

    var resolutionGroup = addSetting(container, i18n._("Resolution"));
    var resolutionEdit = DuScriptUI.selector( resolutionGroup );
    resolutionEdit.addButton( { text: i18n._p("resolution", "Full"), data: [1,1] } );
    resolutionEdit.addButton( { text: i18n._p("resolution", "Half"), data: [2,2] } );
    resolutionEdit.addButton( { text: i18n._p("resolution", "Third"), data: [3,3] } );
    resolutionEdit.addButton( { text: i18n._p("resolution", "Quarter"), data: [4,4] } );
    resolutionEdit.setCurrentIndex(0);
    
    var preserveResolutionGroup = addSetting(container, i18n._("Preserve resolution"));
    var preserveResolutionEdit = DuScriptUI.checkBox(
        preserveResolutionGroup,
        { text: i18n._("Preserve") } /// TRANSLATORS: for the resolution or the framerate, as in "don't change the resolution or the framerate"
        ); 

    var bgGroup = addSetting(container, i18n._("Background color"));
    var bgEdit = DuScriptUI.colorSelector( bgGroup );

    var shyGroup = addSetting(container, i18n._("Shy layers"));
    var shyEdit = DuScriptUI.checkBox( shyGroup, { text: i18n._("Hide") } );

    DuScriptUI.separator( container, uiMode <= 1 ? i18n._("Rendering") : '' );

    var proxyGroup = addSetting(container, i18n._("Proxy"));
    var proxyEdit = DuScriptUI.checkBox( proxyGroup, { text: i18n._("Use") } );

    var rendererGroup = addSetting(container, i18n._("Renderer"));
    var rendererEdit = DuScriptUI.selector( rendererGroup );
    // Create a temp comp to populate
    var comp = app.project.items.addComp('temp', 4, 4, 1, 1, 24);
    for (var i = 0, n = comp.renderers.length; i < n; i++) {
        rendererEdit.addButton( { text: DuAEComp.RendererNames[comp.renderers[i]], data: comp.renderers[i] } );
    }
    rendererEdit.setCurrentIndex(0);
    comp.remove();

    var preserveFrameRateGroup = addSetting(container, i18n._("Preserve frame rate"));
    var preserveFrameRateEdit = DuScriptUI.checkBox( preserveFrameRateGroup, { text: i18n._("Preserve") } );

    var frameBlendingGroup = addSetting(container, i18n._("Frame blending"));
    var frameBlendingEdit = DuScriptUI.checkBox( frameBlendingGroup, { text: i18n._("Enabled") } );

    DuScriptUI.separator( container, uiMode <= 1 ? i18n._("Motion blur") : '' );

    var mbGroup = addSetting(container, i18n._("Motion blur"));
    var mbEdit = DuScriptUI.checkBox( mbGroup, { text: i18n._("Enabled") } );

    var shutterGroup = DuScriptUI.group(container, 'row');

    var shutterLinkButton =  DuScriptUI.checkBox( shutterGroup, {
        text: '',
        helpTip: i18n._("Constraint the dimensions together."),
        image: w12_constraints,
        imageChecked: w12_unlink_chain
    });
    shutterLinkButton.alignment = ['left', 'center'];

    var shutterValuesGroup = DuScriptUI.group( shutterGroup, 'column' );

    var shutterAngleGroup = addSetting(shutterValuesGroup, i18n._("Shutter angle"));
    shutterAngleGroup.onClick = function() {
        if (shutterPhaseGroup.checked) return;
        var comp = DuAEProject.getSelectedComp();
        if (!comp) return;
        shutterAngleEdit.setText(comp.shutterAngle);
        shutterPhaseEdit.setText(comp.shutterPhase);
    }
    var shutterAngleEdit = DuScriptUI.editText( shutterAngleGroup, {
        text: '90',
        suffix: " \u00B0"
    });
    shutterAngleEdit.onChange = function() {
        if (shutterLinkButton.checked) return;

        var angle = parseInt(shutterAngleEdit.text);
        if ( isNaN(angle) ) return;
        var prevAngle = parseInt( shutterAngleEdit.previousText );
        if ( isNaN(prevAngle) ) return;
        if (prevAngle == 0) return;

        var phase = parseInt(shutterPhaseEdit.text);
        if ( isNaN(phase) ) return;      

        shutterPhaseEdit.freeze = true;

        phase = angle * phase / prevAngle;
        shutterPhaseEdit.setText( Math.round(phase) );

        shutterPhaseEdit.freeze = false;
    };

    var shutterPhaseGroup = addSetting(shutterValuesGroup, i18n._("Shutter phase"));
    shutterPhaseGroup.onClick = function() {
        if (shutterAngleGroup.checked) return;
        var comp = DuAEProject.getSelectedComp();
        if (!comp) return;
        shutterAngleEdit.setText(comp.shutterAngle);
        shutterPhaseEdit.setText(comp.shutterPhase);
    }
    var shutterPhaseEdit = DuScriptUI.editText( shutterPhaseGroup, {
        text: '-45',
        suffix: " \u00B0"
    });
    shutterPhaseEdit.onChange = function() {
        if (shutterLinkButton.checked) return;

        var phase = parseInt(shutterPhaseEdit.text);
        if ( isNaN(phase) ) return;
        var prevPhase = parseInt( shutterPhaseEdit.previousText );
        if ( isNaN(prevPhase) ) return;
        if (prevPhase == 0) return;

        var angle = parseInt(shutterAngleEdit.text);
        if ( isNaN(angle) ) return;

        shutterAngleEdit.freeze = true;

        angle = phase * angle / prevPhase;
        shutterAngleEdit.setText( Math.round(angle) );

        shutterAngleEdit.freeze = false;
    };

    var shutterSamplesGroup = addSetting(container, i18n._("Samples"));
    shutterSamplesGroup.onClick = function() {
        var comp = DuAEProject.getSelectedComp();
        if (!comp) return;
        shutterSamplesEdit.setText(comp.motionBlurSamplesPerFrame);
    };
    var shutterSamplesEdit = DuScriptUI.editText( shutterSamplesGroup, {
        text: '16'
    });

    var shutterLimitGroup = addSetting(container, i18n._("Adaptive sample limit"));
    shutterLimitGroup.onClick = function() {
        var comp = DuAEProject.getSelectedComp();
        if (!comp) return;
        shutterLimitEdit.setText(comp.motionBlurAdaptiveSampleLimit);
    };
    var shutterLimitEdit = DuScriptUI.editText( shutterLimitGroup, {
        text: '128'
    });

    DuScriptUI.separator( container );

    var updatePrecompsButton = DuScriptUI.checkBox( container, { text: i18n._("Update precompositions") } );
    updatePrecompsButton.setChecked( true );

    var validButton = addValidButton (
        container,
        i18n._("Comp settings"),
        i18n._("Set the current or selected composition(s) settings, also changing the settings of all precompositions.")
    );
    validButton.onClick = function() {
        // Gather options
        var options = {};

        if (widthGroup.checked) {
            var w = widthEdit.text;
            w = parseInt(w);
            if (!isNaN(w) && w >= 4) options.width = w;
        }
        
        if (heightGroup.checked) {
            var h = heightEdit.text;
            h = parseInt(h);
            if (!isNaN(h) && h >= 4) options.height = h;
        }

        options.anchor = sizeAnchorPopup.anchor;

        if (parGroup.checked) options.pixelAspect = parEdit.currentData;

        if (frameRateGroup.checked) {
            var fr = parseFloat(frameRateEdit.text);
            if (!isNaN(fr) && fr >= 1 && fr <= 999)  options.frameRate = fr;
        }

        if (durationGroup.checked) options.duration = durationEdit.text;

        if (resolutionGroup.checked) options.resolutionFactor = resolutionEdit.currentData;

        if (preserveResolutionGroup.checked) options.preserveNestedResolution = preserveResolutionEdit.checked;

        if (bgGroup.checked) options.bgColor = bgEdit.color.floatRGB();

        if (shyGroup.checked) options.hideShyLayers = shyEdit.checked;

        if (proxyGroup.checked) options.useProxy = proxyEdit.checked;

        if (rendererGroup.checked) options.renderer = rendererEdit.currentData;

        if (preserveFrameRateGroup.checked) options.preserveNestedFrameRate = preserveFrameRateEdit.checked;

        if (frameBlendingGroup.checked) options.frameBlending = frameBlendingEdit.checked;

        if (mbGroup.checked) options.motionBlur = mbEdit.checked;

        if (shutterAngleGroup.checked) {
            var v = shutterAngleEdit.text;
            v = parseInt(v);
            if (!isNaN(v) && v >= 0 && v <= 720) options.shutterAngle = v;
        }

        if (shutterPhaseGroup.checked) {
            var v = shutterPhaseEdit.text;
            v = parseInt(v);
            if (!isNaN(v) && v >= -360 && v <= 360) options.shutterPhase = v;
        }

        if (shutterSamplesGroup.checked) {
            var v = shutterSamplesEdit.text;
            v = parseInt(v);
            if (!isNaN(v) && v >= 2 && v <= 64) options.motionBlurSamplesPerFrame = v;
        }

        if (shutterLimitGroup.checked) {
            var v = shutterLimitEdit.text;
            v = parseInt(v);
            if (!isNaN(v) && v >= 62 && v <= 256) options.motionBlurAdaptiveSampleLimit = v;
        }

        DuAE.beginUndoGroup( i18n._("Comp settings") );

        DuAEComp.updateSettings(options);

        DuAE.endUndoGroup();
    };
}