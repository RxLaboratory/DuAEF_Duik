function buildConstraintsUI(tab, standAlone) {
    standAlone = def(standAlone, false);

    if (!standAlone) {
        // A Spacer
        var spacer = tab.add('group');
        spacer.margins = 0;
        spacer.spacing = 0;
        spacer.size = [-1, 3];

        // A title
        DuScriptUI.staticText(tab, i18n._("Links and constraints")).alignment = ['center', 'top'];
    }

    // Useful methods
    function hideAllGroups() {
        parentAcrossCompGroup.visible = false;
        pathConstraintGroup.visible = false;
        constraintsGroup.visible = false;
        propInfoGroup.visible = false;
        measureGroup.visible = false;
        moveAnchorPointGroup.visible = false;
        connectorGroup.visible = false;
        effectorMapGroup.visible = false;
    }

    // tools
    var toolsGroup = DuScriptUI.toolBar(tab);

    createListButton( toolsGroup );

    var separateButton = toolsGroup.addButton(
        i18n._("Split values"),
        w12_separate_dimensions,
        i18n._("Separate the dimensions of the selected properties.\nAlso works with colors, separated to RGB or HSL.")
    );
    separateButton.onClick = Duik.Constraint.separateDimensions;

    var unlinkButton = toolsGroup.addButton(
        i18n._("Edit mode"),
        w12_unlink,
        i18n._("Toggle edit mode")
    );
    unlinkButton.onClick = Duik.Layer.unlink;

    var lockButton = toolsGroup.addButton(
        i18n._("Lock prop."),
        w12_lock,
        i18n._("Lock the value of the selected properties."),
    );
    lockButton.onClick = Duik.Constraint.lock;

    var zeroButton = toolsGroup.addButton(
        i18n._("Add zero"),
        w12_zero,
        i18n._("Zero out the selected layers transformation.\n[Alt]: Reset the transformation of the selected layers to 0.\n[Ctrl] + [Alt]: Also reset the opacity to 100 %.")
    );
    zeroButton.onClick = Duik.Constraint.zero;
    zeroButton.onAltClick = Duik.Constraint.resetPRS;
    zeroButton.onCtrlAltClick = function() {
        Duik.Constraint.resetPRS(undefined, true);
    };

    var moveAnchorPointButton = createMoveAnchorPointButton(toolsGroup, mainGroup, hideAllGroups);
    moveAnchorPointButton.onClick = function() {

        if (!moveAnchorPointGroup.built) {
            buildMoveAnchorPointGroup(moveAnchorPointGroup, constraintsGroup);
        }

        hideAllGroups();
        moveAnchorPointGroup.visible = true;
    };

    var etmButton = toolsGroup.addButton(
        i18n._("Expose transform"),
        w12_expose_transform,
        i18n._("Expose the transformation of layers using a nice controller.")
    );
    etmButton.onClick = Duik.Constraint.exposeTransform;

    var locatorButton = toolsGroup.addButton(
        i18n._("Locator"),
        w12_locator,
        i18n._("Create locator.")
    );
    locatorButton.onClick = Duik.Constraint.locator;

    var extractLocatorButton = toolsGroup.addButton(
        i18n._("Extract locators"),
        w12_extract_locator,
        i18n._("Extract locators."),
        true
    );
    extractLocatorButton.optionsPopup.build = function() {
        locatorModeSelector = DuScriptUI.selector(extractLocatorButton.optionsPanel);
        locatorModeSelector.addButton(
            i18n._("Use expressions"),
            w16_expression
        );
        locatorModeSelector.addButton(
            i18n._("Use essential properties"),
            w16_essential_property
        );
        locatorModeSelector.setCurrentIndex(1);

        extractLocatorButton.onClick = function() {
            var useEssentialProperties = locatorModeSelector.index == 1;
            Duik.Constraint.extractLocators(useEssentialProperties);
        }
    }

    createAlignButton(toolsGroup);

    var measureButton = toolsGroup.addButton(
        i18n._("Measure distance"),
        w12_measure,
        i18n._("Measure the distance between two layers.")
    );
    measureButton.onClick = function() {
        
        // Build panel
        if (!measureGroup.built) {
            createSubPanel(
                measureGroup,
                i18n._("Measure distance"),
                constraintsGroup,
                false
            );

            measureText = DuScriptUI.staticText(measureGroup, '', undefined, false);

            measureValidButton = addValidButton (
                measureGroup,
                i18n._("Measure distance"),
                i18n._("Measure the distance between two layers.")
            );

            measureValidButton.onClick = function() {
                var dist = DuAELayer.getDistance();
                dist = Math.round(dist);
                if (dist < 0) measureText.setText( i18n._("Select two layers to measure the distance between them."));
                else measureText.setText( i18n._("The distance is %1 px", dist));
            };

            DuScriptUI.showUI(measureGroup);
        }

        measureValidButton.onClick();

        hideAllGroups()
        measureGroup.visible = true;
    };

    var propInfoButton = toolsGroup.addButton(
        i18n._("Prop. info"),
        DuScriptUI.Icon.HELP,
        i18n._("Get property detailed information.")
    );
    propInfoButton.onClick = function() {
        function update() {
            var props = DuAEComp.getSelectedProps();
            if (props.length == 0) return;
            var prop = props[props.length - 1];
            var comp = prop.comp;

            propInfoGroup.prop = prop;
            propInfoGroup.propInfoIndex.text = prop.index;
            propInfoGroup.name.text = prop.name;
            propInfoGroup.matchName.text = prop.matchName;
            propInfoGroup.dimensions.text = prop.dimensions();
            propInfoGroup.link.text = prop.expressionLink(prop, true, true);
            var preExpression = propInfoGroup.preExp.value;
            var fastMode = !propInfoGroup.precision.value;

            //Min and max val per axis
            var minVal = "";
            var maxVal = "";
            if (prop.dimensions() == 1) {
                var range = prop.range(0, preExpression, fastMode);
                minVal = Math.round(range[0] * 100) / 100;
                maxVal = Math.round(range[1] * 100) / 100;
            } else {
                for (var i = 0; i < prop.dimensions(); i++) {
                    var range = prop.range(i, preExpression);
                    if (i == 0) {
                        minVal += "[ ";
                        maxVal += "[ ";
                    }

                    minVal += Math.round(range[0] * 100) / 100;
                    maxVal += Math.round(range[1] * 100) / 100;

                    if (i == prop.dimensions() - 1) {
                        minVal += " ]";
                        maxVal += " ]";
                    } else {
                        minVal += " , ";
                        maxVal += " , ";
                    }
                }
            }
            propInfoGroup.minVal.text = minVal;
            propInfoGroup.maxVal.text = maxVal;
            var maxSpeed = Math.round(prop.maxSpeed(preExpression, fastMode) * 100) / 100;
            propInfoGroup.velocity.text = maxSpeed;
            if (maxSpeed == 0) propInfoGroup.averageVelocity.text = 0;
            else propInfoGroup.averageVelocity.text = Math.round(prop.averageSpeed(preExpression, fastMode) * 100) / 100;

            // Keyframes
            var numKeys = prop.numKeys(false); // the actual prop
            propInfoGroup.numKeyframes.text = prop.numKeys(true); // recursive
            if (numKeys > 0) {
                var duration = prop.keyTime( numKeys ) - prop.keyTime(1)
                propInfoGroup.keysDuration.text = (Math.round(duration*100)/100) + 's (' + Math.round(duration * comp.frameRate) + ' frames)';
            }
            else propInfoGroup.keysDuration.text = '0';
            selectedKeys = prop.selectedKeys();
            if (selectedKeys.length > 0) {
                var duration = prop.keyTime( selectedKeys[selectedKeys.length - 1] ) - prop.keyTime( selectedKeys[0] );
                propInfoGroup.selectedKeyDuration.text = (Math.round(duration*100)/100) + 's (' + Math.round(duration * comp.frameRate) + ' frames)';
            }
            else propInfoGroup.selectedKeyDuration.text = '0';
        }

        // Build panel
        if (!propInfoGroup.built) {
            var titleBar = createSubPanel(
                propInfoGroup,
                i18n._("Prop. info"),
                constraintsGroup,
                false
            );

            var propInfoForm = DuScriptUI.form(propInfoGroup);
            propInfoGroup.propInfoIndex = propInfoForm.addField("Index", "statictext", "0", "The index of the property")[1];
            propInfoGroup.name = propInfoForm.addField("Name", "edittext", "", "The name of the property")[1];
            propInfoGroup.matchName = propInfoForm.addField("Match Name", "edittext", "", "The matchName of the property")[1];
            propInfoGroup.dimensions = propInfoForm.addField("Num Dimensions", "statictext", "0", "The number of dimensions of the property")[1];
            propInfoGroup.link = propInfoForm.addField("Expression link", "edittext", "", "The expression link to the property (from the layer)")[1];
            propInfoGroup.minVal = propInfoForm.addField("Minimum value", "edittext", "", "The minimum value during the animation.")[1];
            propInfoGroup.maxVal = propInfoForm.addField("Maximum value", "edittext", "", "The maximum value during the animation.")[1];
            propInfoGroup.velocity = propInfoForm.addField("Maximum velocity", "edittext", "", "The maximum velocity during the animation.")[1];
            propInfoGroup.averageVelocity = propInfoForm.addField("Average velocity", "edittext", "", "The average velocity during the animation.")[1];
            propInfoGroup.numKeyframes = propInfoForm.addField("Number of keyframes", "statictext", "", "The keyframe count.")[1];
            propInfoGroup.selectedKeyDuration = propInfoForm.addField("Selected keys duration", "edittext", "", "The duration between the selected keyframes.")[1];
            propInfoGroup.keysDuration = propInfoForm.addField("Keyframes duration", "edittext", "", "The duration between the first and the last keyframe.")[1];
            propInfoGroup.preExp = propInfoForm.addField("Pre-expression val.", "checkbox", "", "Display pre-expression values.")[1];
            propInfoGroup.precision = propInfoForm.addField("Hi-precision", "checkbox", "", "Samples the values and velocity with a higher precision.\nWarning: this can be quite slong if the composition is very long.")[1];


            var validButton = addValidButton(
                propInfoGroup,
                i18n._("Get property info"),
                i18n._("Get property detailed information.")
            );
            validButton.onClick = update;

            DuScriptUI.showUI(propInfoGroup);
        }

        //values
        update();

        hideAllGroups()
        propInfoGroup.visible = true;
    };

    var mainGroup = DuScriptUI.group(tab, 'stacked');
    //mainGroup.margins = 3;
    mainGroup.alignment = ['fill', 'fill'];

    var constraintsGroup = DuScriptUI.group(mainGroup, 'column');
    if (uiMode >= 2) constraintsGroup.spacing = 3;

    var line1 = DuScriptUI.group(constraintsGroup, uiMode >= 2 ? 'row' : 'column');

    createAutorigButton(line1);

    var connectorButton = DuScriptUI.button(
        line1,
        i18n._("Connector"),
        w16_connector,
        i18n._("Connect slave properties to a master property."),
        true, // options
        undefined, // orientation
        undefined, // alignment
        false, // ignoreUIMode
        true, // optionsWithoutButton
        undefined, // optionsButtonText
        true // optionsWithoutPanel
    );
    connectorButton.onClick = Duik.Constraint.quickConnector;
    connectorButton.onOptions = function(showUI) {
        if (!connectorGroup.built) {
            // Utils
            // Connector variables
            var connector = {};
            connector.master = null;
            connector.type = 'prop';

            function createConnectOpacitiesButtonn( group ) {
                var connectToOpacitiesButton = DuScriptUI.button(
                    group,
                    i18n._("Layer opacities"),
                    w16_layers,
                    i18n._("Connects the selected layers to the control you've just set, using their opacity properties to switch their visibility."),
                    false,
                    'column'
                );
                connectToOpacitiesButton.onClick = function() {
                    // Get layer selection
                    var layers = DuAEComp.getSelectedLayers();
                    if (layers.length == 0) return;
    
                    // Prepare settings
                    var min = parseFloat(minEdit.text);
                    var max = parseFloat(maxEdit.text);
                    var type = typeList.selection.index + 1;
                    var axis = DuAE.Axis.X;
                    var dim = connector.master.dimensions();
                    if (dim == 2 || dim == 3) {
                        if (axisList.selection.index == 1) axis = DuAE.Axis.Y;
                        else if (axisList.selection.index == 2) axis = DuAE.Axis.Z;
                    } else if (dim == 4) {
                        if (axisList.selection.index == 0) axis = DuAE.Axis.RED;
                        else if (axisList.selection.index == 1) axis = DuAE.Axis.GREEN;
                        else if (axisList.selection.index == 2) axis = DuAE.Axis.BLUE;
                        else if (axisList.selection.index == 3) axis = DuAE.Axis.ALPHA;
                        else if (axisList.selection.index == 4) axis = DuAE.Axis.HUE;
                        else if (axisList.selection.index == 5) axis = DuAE.Axis.SATURATION;
                        else if (axisList.selection.index == 6) axis = DuAE.Axis.VALUE;
                    }
    
                    DuAE.beginUndoGroup(i18n._("Connector"))
    
                    DuAELayer.sequence(layers);
                    // List layer opacities
                    var props = [];
                    for (var i = 0, n = layers.length; i < n; i++) {
                        var o = new DuAEProperty(layers[i].transform.opacity);
                        props.push(o);
                    }
                    Duik.Constraint.connector(props, connector.master, min, max, axis, type);
    
                    DuAE.endUndoGroup();
                };
            }

            function createConnectPropButton( group ) {
                var connectToPropsButton = DuScriptUI.button(
                    group,
                    i18n._("Properties"),
                    w16_props,
                    i18n._("Connects the selected properties to the control you've just set."),
                    false,
                    'column'
                );
                connectToPropsButton.onClick = function() {
                    var props = DuAEComp.getSelectedProps();
                    if (props.length == 0) return;
    
                    // Prepare settings
                    var min = parseFloat(minEdit.text);
                    var max = parseFloat(maxEdit.text);
                    var typeIndex = 0;
                    if (typeList.selection) typeIndex = typeList.selection.index;
                    var type = typeIndex + 1;
                    var axis = DuAE.Axis.X;
                    var dim = connector.master.dimensions();
                    if (dim == 2 || dim == 3) {
                        if (axisList.selection.index == 1) axis = DuAE.Axis.Y;
                        else if (axisList.selection.index == 2) axis = DuAE.Axis.Z;
                    } else if (dim == 4) {
                        if (axisList.selection.index == 0) axis = DuAE.Axis.RED;
                        else if (axisList.selection.index == 1) axis = DuAE.Axis.GREEN;
                        else if (axisList.selection.index == 2) axis = DuAE.Axis.BLUE;
                        else if (axisList.selection.index == 3) axis = DuAE.Axis.ALPHA;
                        else if (axisList.selection.index == 4) axis = DuAE.Axis.HUE;
                        else if (axisList.selection.index == 5) axis = DuAE.Axis.SATURATION;
                        else if (axisList.selection.index == 6) axis = DuAE.Axis.VALUE;
                    }
    
                    DuAE.beginUndoGroup(i18n._("Connector"));
    
                    Duik.Constraint.connector(props, connector.master, min, max, axis, type, false);
    
                    DuAE.endUndoGroup();
                };
            }

            function createConnectKeyMorphButton( group ) {
                var connectToKeyMorphButton = DuScriptUI.button(
                    group,
                    i18n._("Key Morph"),
                    w16_shape_keys,
                    i18n._("Connects the selected keys to the control you've just set."),
                    false,
                    'column'
                );
                connectToKeyMorphButton.onClick = function() {
                    var props = DuAEComp.getSelectedProps();
                    if (props.length == 0) return;
    
                    // Prepare settings
                    var min = parseFloat(minEdit.text);
                    var max = parseFloat(maxEdit.text);
                    var typeIndex = 0;
                    if (typeList.selection) typeIndex = typeList.selection.index;
                    var type = typeIndex + 1;
                    var axis = DuAE.Axis.X;
                    var dim = connector.master.dimensions();
                    if (dim == 2 || dim == 3) {
                        if (axisList.selection.index == 1) axis = DuAE.Axis.Y;
                        else if (axisList.selection.index == 2) axis = DuAE.Axis.Z;
                    } else if (dim == 4) {
                        if (axisList.selection.index == 0) axis = DuAE.Axis.RED;
                        else if (axisList.selection.index == 1) axis = DuAE.Axis.GREEN;
                        else if (axisList.selection.index == 2) axis = DuAE.Axis.BLUE;
                        else if (axisList.selection.index == 3) axis = DuAE.Axis.ALPHA;
                        else if (axisList.selection.index == 4) axis = DuAE.Axis.HUE;
                        else if (axisList.selection.index == 5) axis = DuAE.Axis.SATURATION;
                        else if (axisList.selection.index == 6) axis = DuAE.Axis.VALUE;
                    }
    
                    DuAE.beginUndoGroup(i18n._("Connector"));
    
                    Duik.Constraint.connector(props, connector.master, min, max, axis, type, true);
    
                    DuAE.endUndoGroup();
                };
            }

            // Picks the selected property / layer / control...
            function connectorPick() {
                connector.master = null;

                // First, get the selected layer
                var layer = DuAEComp.getActiveLayer();
                if (!layer) return;

                // Disable prop selection by default
                propList.removeAll();
                propListLabel.enabled = false;
                propList.enabled = false;

                // If there's a selected property, let's use it
                var prop = DuAELayer.getActiveProperty(layer);
                if (prop) {
                    if (prop.isProperty()) {
                        // Title
                        propLabel.text = prop.layer.index + ' - ' + prop.layer.name + ' # ' + prop.name;
                        connectorLoadMasterProperty(prop, 'prop');
                        return;
                    }
                }

                // If it's just a layer, check if there's something we know how to connect

                // Is it a slider?
                var pe = Duik.PseudoEffect.CONTROLLER_SLIDER;
                var effect = layer.effect(pe.matchName);
                if (effect) {
                    // Title
                    propLabel.text = layer.index + ' - ' + layer.name + ' # ' + i18n._("Slider");
                    var p = new DuAEProperty(effect(pe.props['Value'].index));
                    connectorLoadMasterProperty(p, 'prop');
                    // Default values
                    minEdit.setText('-100');
                    maxEdit.setText('100');
                    return;
                }

                // Is it a 2D Slider?
                pe = Duik.PseudoEffect.CONTROLLER_2DSLIDER;
                effect = layer.effect(pe.matchName);
                if (effect) {
                    // Title
                    propLabel.text = layer.index + ' - ' + layer.name + ' # ' + i18n._("2D Slider");
                    var p = new DuAEProperty(effect(pe.props['2D Value'].index));
                    connectorLoadMasterProperty(p, 'prop');
                    // Default values
                    minEdit.setText('-100');
                    maxEdit.setText('100');
                    return;
                }

                // Is it an angle?
                pe = Duik.PseudoEffect.CONTROLLER_ANGLE;
                effect = layer.effect(pe.matchName);
                if (effect) {
                    // Title
                    propLabel.text = layer.index + ' - ' + layer.name + ' # ' + i18n._("Angle");
                    var p = new DuAEProperty(effect(pe.props['Angle'].index));
                    connectorLoadMasterProperty(p, 'prop');
                    // Default values
                    minEdit.setText('0');
                    maxEdit.setText('360');
                    return;
                }

                // Is it an expose transform?
                pe = Duik.PseudoEffect.EXPOSE_TRANSFORM;
                effect = layer.effect(pe.matchName);
                if (effect) {
                    propLabel.text = layer.index + ' - ' + layer.name + ' # ' + i18n._("Expose transform");
                    // Set the prop list
                    propList.removeAll();
                    propList.add( 'item', "Absolute position (2D)" );
                    propList.add( 'item', "Relative position (2D)" );
                    propList.add( 'item', "Distance (2D)" );
                    propList.add( 'item', "Absolute position (3D)" );
                    propList.add( 'item', "Relative position (3D)" );
                    propList.add( 'item', "Distance (3D)" );
                    propList.add( 'item', "Absolute orientation" );
                    propList.add( 'item', "Relative orientation" );
                    propList.add( 'item', "Angle" );
                    propList.selection = 2;
                    propListLabel.enabled = true;
                    propList.enabled = true;
                    var p = new DuAEProperty(effect(pe.props['2D Position (Comp projection)']['2D Distance'].index));
                    connectorLoadMasterProperty(p, 'etm');
                    return;
                }

                // Is it an IK?
                pe = Duik.PseudoEffect.TWO_LAYER_IK;
                effect = layer.effect(pe.matchName);
                if (effect) {
                    // Title
                    propLabel.text = layer.index + ' - ' + layer.name + ' # ' + i18n._("IK");
                    // Set the prop list
                    propList.removeAll();
                    propList.add( 'item', "IK Length" );
                    propList.add( 'item', "Upper Stretch" );
                    propList.add( 'item', "Lower Stretch" );
                    propList.selection = 0;
                    propListLabel.enabled = true;
                    propList.enabled = true;
                    var p = new DuAEProperty(effect(pe.props['Data']['Stretch data']['IK Goal distance'].index));
                    connectorLoadMasterProperty(p, 'ik');
                    return;
                }

                // Is it an Audio effector?
                var effects = layer.property('ADBE Effect Parade');
                for(var i = 1; i <= effects.numProperties; i++) {
                    var effect = effects.property(i);
                    if (effect.matchName == 'ADBE Slider Control' && effect.name == i18n._("Audio Effector") && effect(1).expression != '') {
                        connectorLoadMasterProperty( new DuAEProperty(effect(1)), 'prop');
                        return;
                    }
                }
            };

            function connectorLoadMasterProperty(prop, type) {
                connector.type = type;

                if (type == 'prop' || type == 'ik' || type == 'etm') {
                    connector.master = prop;

                    // Prepare UI according to the number of dimensions
                    var dim = prop.dimensions();

                    if (dim == 0) {
                        alert("This property cannot be used as a master property with the connector.");
                        return;
                    } else if (dim == 1) {
                        axisList.removeAll();
                        axisList.enabled = false;
                        axisLabel.enabled = false;
                        axisLabel.text = i18n._("Axis");
                        typeList.selection = 0;
                    } else if (dim == 2) {
                        axisList.removeAll();
                        axisList.enabled = true;
                        axisList.add('item', 'X');
                        axisList.add('item', 'Y');
                        axisList.selection = 0;
                        axisLabel.text = i18n._("Axis");
                        axisLabel.enabled = true;
                    } else if (dim == 3) {
                        axisList.removeAll();
                        axisList.enabled = true;
                        axisList.add('item', 'X');
                        axisList.add('item', 'Y');
                        axisList.add('item', 'Z');
                        axisList.selection = 0;
                        axisLabel.text = i18n._("Axis");
                        axisLabel.enabled = true;
                    } else if (dim == 4) {
                        axisList.removeAll();
                        axisList.enabled = true;
                        axisList.add('item', "Red");
                        axisList.add('item', "Green");
                        axisList.add('item', "Blue");
                        axisList.add('item', "Alpha");
                        axisList.add('item', "Hue");
                        axisList.add('item', "Saturation");
                        axisList.add('item', "Value");
                        axisList.selection = 4;
                        axisLabel.text = i18n._("Channel");
                        axisLabel.enabled = true;
                        minEdit.setText('0');
                        if (app.project.bitsPerChannel == 8) maxEdit.setText('255');
                        else if (app.project.bitsPerChannel == 16) maxEdit.setText('65536');
                        else if (app.project.bitsPerChannel == 32) maxEdit.setText('1.0');
                    }

                    minEdit.setSuffix(prop.unit());
                    maxEdit.setSuffix(prop.unit());

                    //use a percent if this is a 2D Slider
                    if (prop.matchName.indexOf(Duik.PseudoEffect.CONTROLLER_2DSLIDER.matchName) == 0) {
                        minEdit.setSuffix("%");
                        maxEdit.setSuffix("%");
                    }

                    // Update range
                    connectorUpdateRange();

                    createGroup.visible = false;
                    settingsGroup.visible = true;
                    return;
                }

                if (type == 'layerList') {
                    // Check if it's a dropdown
                    if (prop.isDropdown()) {
                        connector.master = prop;
                        // Show the dropdown panel
                        createGroup.visible = false;
                        dropdownGroup.visible = true;
                    }
                    else
                    {
                        connectorLoadMasterProperty(prop, 'prop');
                    }
                    return;
                }

                if (type == 'audio') {
                    connector.master = prop;
                    axisList.removeAll();
                    axisList.enabled = false;
                    axisLabel.enabled = false;
                    axisLabel.text = i18n._("Axis");
                    typeList.selection = 0;

                    minEdit.setSuffix('%');
                    maxEdit.setSuffix('%');

                    minEdit.setText('0');
                    maxEdit.setText('100');

                    createGroup.visible = false;
                    connectGroup.visible = true;
                    return;
                }
            }

            function connectorUpdateRange() {
                if (!connector.master) return;

                var axis = 0;

                if (axisList.selection) axis = axisList.selection.index;
   
                var preExpression = false;
                //if (connector.master.numKeys() < 2) preExpression = false;

                var range = [0, 100];
                if (typeList.selection.index == 0) range = connector.master.range(axis, preExpression, true);
                else if (typeList.selection.index == 1) { // Speed
                    var speed = connector.master.maxSpeed(preExpression, true);
                    range = [0, Math.floor(speed * 100) / 100];
                }
                else { // Velocity
                    var velocityMax = connector.master.maxVelocity(axis, preExpression, true);
                    var velocityMin = connector.master.minVelocity(axis, preExpression, true);
                    range = [ Math.floor(velocityMin * 100) / 100, Math.floor(velocityMax * 100) / 100];
                }

                if (range.length != 2) return;

                var min = Math.floor(range[0]);
                var max = Math.floor(range[1]);

                if (connector.master.matchName.indexOf(Duik.PseudoEffect.CONTROLLER_2DSLIDER.matchName) == 0) {
                    if (min == 0 && max == 0) { 
                        min = -100;
                        max = 100;
                    }
                }

                minEdit.setText(min);
                maxEdit.setText(max);
            }

            var titleBar = createSubPanel(
                connectorGroup,
                i18n._("Connector"),
                constraintsGroup
            );

            var connectorStack = DuScriptUI.group(connectorGroup, 'stacked');

            var createGroup = DuScriptUI.group(connectorStack, 'column');
            createGroup.margins = 3;

            var createLabel = DuScriptUI.staticText(
                createGroup,
                i18n._("Choose or create control")
            );
            createLabel.alignment = ['center', 'top'];

            var createGrid = DuScriptUI.group(createGroup, 'row');
            createGrid.alignment = ['fill', 'top'];
            var createLine1 = DuScriptUI.group(createGrid, 'column');
            createLine1.alignment = ['fill', 'fill'];
            var createLine2 = DuScriptUI.group(createGrid, 'column');
            createLine2.alignment = ['fill', 'fill'];
            var createLine3 = DuScriptUI.group(createGrid, 'column');
            createLine3.alignment = ['fill', 'fill'];

            var sliderButton = DuScriptUI.button(
                createLine1,
                i18n._("Slider"),
                w16_slider,
                i18n._("Create a slider controller."),
                false,
                'column'
            );
            sliderButton.onClick = function() {
                DuAE.beginUndoGroup( i18n._("Controller"));

                // Create a slider
                var ctrl = Duik.Controller.create(undefined, Duik.Controller.Type.SLIDER);
                if (!ctrl) return;

                connectorPick();
                DuAE.endUndoGroup();
            };

            var slider2DButton = DuScriptUI.button(
                createLine2,
                i18n._("2D Slider"),
                w16_2d_slider,
                i18n._("Create a 2D slider controller."),
                false,
                'column'
            );
            slider2DButton.onClick = function() {
                DuAE.beginUndoGroup( i18n._("Controller"));

                // Create a slider
                var ctrl = Duik.Controller.create(undefined, Duik.Controller.Type.DOUBLE_SLIDER);
                if (!ctrl) return;

                connectorPick();
                DuAE.endUndoGroup();
            };

            var angleButton = DuScriptUI.button(
                createLine3,
                i18n._("Angle"),
                w16_angle,
                i18n._("Create an angle controller."),
                false,
                'column'
            );
            angleButton.onClick = function() {
                DuAE.beginUndoGroup( i18n._("Controller"));

                // Create an angle
                var ctrl = Duik.Controller.create(undefined, Duik.Controller.Type.ANGLE);
                if (!ctrl) return;

                connectorPick();
                DuAE.endUndoGroup();
            };

            var etmButton = DuScriptUI.button(
                createLine1,
                i18n._("Expose transform"),
                w16_expose_transform,
                i18n._("Create a controller to measure lengths, angles and other coordinates between layers."),
                false,
                'column'
            );
            etmButton.onClick = function() {
                DuAE.beginUndoGroup( i18n._("Expose transform"));

                // Create a single expose transform
                var layer = DuAEComp.getActiveLayer();
                var ctrls;
                if (layer) { // for the layer
                    ctrls = Duik.Constraint.exposeTransform(undefined, [layer]);
                }
                else { // just one in the comp
                    ctrls = Duik.Constraint.exposeTransform( DuAEProject.getActiveComp() );
                }
                if (ctrls.length == 0) return;

                connectorPick();

                DuAE.endUndoGroup();
            };

            var layerListButton = DuScriptUI.button(
                createLine2,
                i18n._("Layer list"),
                w16_layers,
                i18n._("Creates a dropdown control to control the visibility of a list of layers.\n\nFirst, select the layer where to create the controlling effect, then click the button to get to the next step."),
                false,
                'column'
            );
            layerListButton.onClick = function () {
                DuAE.beginUndoGroup(i18n._("Connector"));

                // Check if there's a layer selected
                var layer = DuAEComp.getActiveLayer();
                if (!layer) {
                    alert( i18n._("Nothing selected. Please select some layers first."));
                    return;
                }

                // Create a dropdown
                var p = layer.property('ADBE Effect Parade').addProperty('ADBE Dropdown Control');
                p.name = i18n._("Layer list");
                p = new DuAEProperty(p.property(1));
                connectorLoadMasterProperty(p, 'layerList');

                DuAE.endUndoGroup();
            };
            if (!DuAE.version.atLeast('17.0.1')) {
                layerListButton.enabled = false;
            }

            var effectorButton = DuScriptUI.button(
                createLine3,
                i18n._("Effector"),
                w16_effector,
                i18n._("Create a spatial effector to control properties.\n\nSelect the properties to control first, then click on this button."),
                false,
                'column'
            );
            effectorButton.onClick = Duik.Automation.effector;
            
            var mapButton = DuScriptUI.button(
                createLine1,
                i18n._("Pick texture"),
                w16_pick_texture,
                i18n._("Choose a layer to use as a texture map to control the properties."),
                false,
                'column'
            );
            mapButton.onClick = function () {
                if (!effectorMapGroup.built) {
                    buildEffectorMapGroup(effectorMapGroup, constraintsGroup);
                }

                // Set the layer
                effectorMapGroup.layerSelector.refresh();
                var layer = DuAEComp.getActiveLayer();
                if (layer) effectorMapGroup.layerSelector.setCurrentIndex(layer.index);

                hideAllGroups();
                effectorMapGroup.visible = true;
            };

            var audioButton = DuScriptUI.button(
                createLine2,
                i18n._("Pick audio"),
                w16_pick_audio,
                i18n._("Controls properties using an audio layer."),
                false,
                'column'
            );
            audioButton.onClick = function () {
                var prop = Duik.Constraint.setupAudioController();
                if (!prop) return;
                // Disable prop selection by default
                propList.removeAll();
                propListLabel.enabled = false;
                propList.enabled = false;

                // Title
                propLabel.text = i18n._("Audio Effector");
                connectorLoadMasterProperty(prop, 'audio');
            };

            var propButton = DuScriptUI.button(
                createLine3,
                i18n._("Pick control"),
                w16_pick_prop,
                i18n._("Uses the selected property, layer or already existing control."),
                false,
                'column'
            );
            propButton.onClick = connectorPick;

            var settingsGroup = DuScriptUI.group(connectorStack, 'column');
            settingsGroup.margins = 3;
            settingsGroup.visible = false;

            var settingsForm = DuScriptUI.form(settingsGroup);

            var settingsTitleLabel = settingsForm.labels.add('statictext', undefined, i18n._("Connecting"));
            settingsTitleLabel.enabled = false;
            var propListLabel = settingsForm.labels.add('statictext', undefined, i18n._p("After Effects Property", "Property"));
            var typeLabel = settingsForm.labels.add('statictext', undefined, i18n._p("After Effects Property", "Type")); /// TRANSLATORS: A type (A Kind) of property
            var axisLabel = settingsForm.labels.add('statictext', undefined, i18n._p("After Effects Property", "Axis"));
            var minLabel = settingsForm.labels.add('statictext', undefined, i18n._p("After Effects Property Value", "Minimum")); /// TRANSLATORS: For the value of a property
            var maxLabel = settingsForm.labels.add('statictext', undefined, i18n._p("After Effects Property Value", "Maximum")); /// TRANSLATORS: For the value of a property
            var propLabel = settingsForm.buttons.add('statictext', undefined, i18n._(""));
            propLabel.characters = 20;
            var propList = settingsForm.buttons.add('dropdownlist', undefined, ['                      ']);
            var typeList = settingsForm.buttons.add('dropdownlist', undefined, [
                i18n._("Value"),
                i18n._("Speed"),
                i18n._("Velocity")]);
            var axisList = settingsForm.buttons.add('dropdownlist', undefined, ['                      ']);
            var minEdit = DuScriptUI.editText(settingsForm.buttons, '0');
            var maxEdit = DuScriptUI.editText(settingsForm.buttons, '10000');
            propListLabel.minimumSize.height = propListLabel.maximumSize.height = propList.preferredSize[1];
            axisLabel.minimumSize.height = axisLabel.maximumSize.height = axisList.preferredSize[1];
            typeLabel.minimumSize.height = typeLabel.maximumSize.height = typeList.preferredSize[1];
            minLabel.minimumSize.height = minLabel.maximumSize.height = minEdit.edit.preferredSize[1];
            maxLabel.minimumSize.height = maxLabel.maximumSize.height = maxEdit.edit.preferredSize[1];

            axisList.onChange = connectorUpdateRange;

            typeList.onChange = function() {
                if (!connector.master) return;
                if (typeList.selection.index == 0) { // Value
                    if (connector.master.dimensions() > 1) {
                        axisList.enabled = true;
                        axisLabel.enabled = true;
                    }
                    else {
                        axisList.enabled = false;
                        axisLabel.enabled = false;
                    }
                    axisList.onChange();
                    return;
                }
                if (typeList.selection.index == 1) { // Speed
                    axisList.enabled = false;
                    axisLabel.enabled = false;
                    axisList.onChange();
                    return;
                }
                if (typeList.selection.index == 2) { // Velocity
                    if (connector.master.dimensions() > 1) {
                        axisList.enabled = true;
                        axisLabel.enabled = true;
                    }
                    else {
                        axisList.enabled = false;
                        axisLabel.enabled = false;
                    }
                    axisList.onChange();
                    return;
                }
            };

            propList.onChange = function() {
                // Get the property
                if (connector.type == 'ik') {
                    var ikEffect = connector.master.parentProperty();
                    var id = propList.selection.index;
                    var pe = Duik.PseudoEffect.TWO_LAYER_IK;
                    if (id == 0)  connectorLoadMasterProperty(ikEffect.prop(pe.props['Data']['Stretch data']['IK Goal distance'].index), 'ik');
                    else if (id == 1)  connectorLoadMasterProperty(ikEffect.prop(pe.props['Data']['Stretch data']['Upper'].index), 'ik');
                    else if (id == 2)  connectorLoadMasterProperty(ikEffect.prop(pe.props['Data']['Stretch data']['Lower'].index), 'ik');
                }
                else if (connector.type == 'etm') {
                    var etmEffect = connector.master.parentProperty();
                    var id = propList.selection.index;
                    var p = Duik.PseudoEffect.EXPOSE_TRANSFORM.props;
                    var pid = 0;
                    if (id == 0) pid = p['2D Position (Comp projection)']['Absolute'].index;
                    else if (id == 1) pid = p['2D Position (Comp projection)']['Relative to reference'].index;
                    else if (id == 2) pid = p['2D Position (Comp projection)']['2D Distance'].index;
                    else if (id == 3) pid = p['3D Position (World)']['Absolute'].index;
                    else if (id == 4) pid = p['3D Position (World)']['Relative to reference'].index;
                    else if (id == 5) pid = p['3D Position (World)']['3D Distance'].index;
                    else if (id == 6) pid = p['2D Orientation']['Absolute'].index;
                    else if (id == 7) pid = p['2D Orientation']['Relative to reference'].index;
                    else if (id == 7) pid = p['Angle (Layer-This-Reference'].index;
                    connectorLoadMasterProperty(etmEffect.prop(pid), 'etm');
                }
            };

            DuScriptUI.separator(settingsGroup );

            // Add help for rookies
            if ( uiMode == 0) {
                settingsGroup.add('statictext', undefined, i18n._("Select the child properties or layers,\nand connect them."), {
                    multiline: true
                });
            }

            // The create buttons
            var connectButtonsGroup = DuScriptUI.group(settingsGroup, 'row');
            createConnectOpacitiesButtonn( connectButtonsGroup );
            createConnectPropButton( connectButtonsGroup );
            createConnectKeyMorphButton( connectButtonsGroup );

            DuScriptUI.separator(settingsGroup);
            var settingsNavButtons = DuScriptUI.group(settingsGroup, 'row');

            var settingsBackButton = DuScriptUI.button(
                settingsNavButtons,
                i18n._("Back"),
                DuScriptUI.Icon.BACK,
                i18n._("Back"),
                false,
                'row',
                'center'
            );
            settingsBackButton.onClick = function() {
                settingsGroup.visible = false;
                createGroup.visible = true;
            };

            var connectGroup = DuScriptUI.group(connectorStack, 'column');
            connectGroup.visible = false;

            var connectLabel = connectGroup.add('statictext', undefined, i18n._("Select the child properties or layers,\nand connect them."), {
                multiline: true
            });

            connectButtonsGroup = DuScriptUI.group(connectGroup, 'row');

            createConnectOpacitiesButtonn( connectButtonsGroup );
            createConnectPropButton( connectButtonsGroup );
            createConnectKeyMorphButton( connectButtonsGroup );

            var dropdownGroup = DuScriptUI.group(connectorStack, 'column');
            dropdownGroup.visible = false;

            var dropdownTitleLabel = dropdownGroup.add(
                'statictext',
                undefined,
                i18n._("Connecting dropdown menu to layers:\n\nSelect the child layers then connect."),
                {  multiline: true }
                );

            var dropdownConnectButton = DuScriptUI.button(
                dropdownGroup,
                i18n._("Connect layer opacities"),
                w16_layers,
                i18n._("Connect the selected layers to the control you've just set, using their opacity properties to switch their visibility."),
                false,
                'column'
            );
            dropdownConnectButton.onClick = function() {
                // Get layer selection
                var layers = DuAEComp.getSelectedLayers();
                if (layers.length == 0) return;

                // Prepare settings
                var min = 1;
                var max = layers.length;
                var type = 1;
                var axis = DuAE.Axis.X;
                
                DuAE.beginUndoGroup(i18n._("Connector"));

                Duik.Constraint.linkLayersToDropdown(connector.master, layers);

                DuAE.endUndoGroup();

                if(!titleBar.pinned) titleBar.onClose();
            };

            connectorGroup.reInit = function() {
                connector = {};
                connector.master = null;
                connector.type = 'prop';
                createGroup.visible = true;
                settingsGroup.visible = false;
                connectGroup.visible = false;
                dropdownGroup.visible = false;
                typeList.selection = 0;
            };

            connectorGroup.built = true;
            DuScriptUI.showUI(connectorGroup);
        }
        if (showUI) {
            hideAllGroups();
            connectorGroup.visible = true;
            connectorGroup.reInit();
        }
    };

    var keyMorphButton = DuScriptUI.button(
        line1,
        i18n._("Key Morph"),
        w16_shape_keys,
        i18n._("Morph selected properties between arbitrary keyframes.")
    );
    keyMorphButton.onClick = Duik.Constraint.morphKeys;

    var pinsButton = DuScriptUI.button(
        line1,
        i18n._("Add Pins"),
        w16_pin,
        i18n._("Add pin layers to control spatial properties and B\u00e9zier paths.\n[Alt]: Also create tangents for B\u00e9zier path properties."),
        true,
        undefined,
        undefined,
        undefined,
        undefined,
        true // no button on the options popup
    );
    pinsButton.optionsPopup.build = function() {
        // Utils
        function updateEditPanel() {
            setSideSelector(sideEditSelector, Duik.Layer.side());

            setLocationSelector(locationEditSelector, Duik.Layer.location());

            colorEditSelector.setColor(Duik.Pin.color());

            sizeEdit.setText(Duik.Pin.size());

            opacityEdit.setText(Duik.Pin.opacity());

            characterEdit.setText(Duik.Layer.groupName());

            limbEdit.setText(Duik.Layer.name());
        }

        function setSide() {
            var side = getSide(sideEditSelector);
            Duik.Pin.setSide(side);
        }

        function setLocation() {
            var location = getLocation(locationEditSelector);
            Duik.Pin.setLocation(location);
        }

        function setColor() {
            var color = colorEditSelector.color;
            Duik.Pin.setColor(color);
        }

        function setSize() {
            var size = parseInt(sizeEdit.text);
            if (isNaN(size)) return;
            Duik.Pin.setSize(size);
        }

        function setOpacity() {
            var opa = parseInt(opacityEdit.text);
            if (isNaN(opa)) return;
            Duik.Pin.setOpacity(opa);
        }

        function setCharacterName() {
            Duik.Pin.setCharacterName(characterEdit.text);
        }

        function setLimbName() {
            Duik.Pin.setLimbName(limbEdit.text);
        }

        var sideEditGroup = addSetting(pinsButton.optionsPanel, i18n._("Side"));
        var sideEditSelector = createSideSelector(sideEditGroup);

        var locationEditGroup = addSetting(pinsButton.optionsPanel, i18n._("Location"));
        var locationEditSelector = createLocationSelector(locationEditGroup);

        var colorEditGroup = addSetting(pinsButton.optionsPanel, i18n._("Color"));
        var colorEditSelector = DuScriptUI.colorSelector(colorEditGroup, i18n._("Set the color of the selected layers."));

        var sizeEditGroup = addSetting(pinsButton.optionsPanel, i18n._("Size"));
        var sizeEdit = DuScriptUI.editText(
            sizeEditGroup,
            "100",
            '',
            " %",
            "100",
            i18n._("Change the size of the layer."),
            false
        );

        var opacityEditGroup = addSetting(pinsButton.optionsPanel, i18n._("Opacity"));
        var opacityEdit = DuScriptUI.editText(  opacityEditGroup, {
                text: "75",
                suffix: " %",
                placeHolder: "75",
                helpTip: i18n._("Change the opacity of the pins."),
                localize: false
            });

        var characterEditGroup = addSetting(pinsButton.optionsPanel, i18n._("Group name"));
        var characterEdit = DuScriptUI.editText(
            characterEditGroup,
            '',
            '',
            '',
            i18n._("Character / Group name"),
            i18n._("Choose the name of the character."),
            false
        );
        characterEdit.alignment = ['fill', 'fill'];

        var limbEditGroup = addSetting(pinsButton.optionsPanel, i18n._("Name"));
        var limbEdit = DuScriptUI.editText(
            limbEditGroup,
            '',
            '',
            '',
            i18n._("(Limb) Name"),
            i18n._("Change the name of the limb this layer belongs to."),
            false
        )
        limbEdit.alignment = ['fill', 'fill'];

        DuScriptUI.separator(pinsButton.optionsPanel);

        // Valid button
        var applyGroup = DuScriptUI.group( pinsButton.optionsPanel, 'row' );

        var pickButton = DuScriptUI.button(
            applyGroup,
            i18n._("Pick selected layer"),
            DuScriptUI.Icon.EYE_DROPPER
        );
        pickButton.onClick = updateEditPanel;


        var applyEditButton = DuScriptUI.button(
            applyGroup,
            i18n._("Apply"),
            DuScriptUI.Icon.CHECK,
            i18n._("Apply")
        )
        applyEditButton.onClick = function() {
            DuAE.beginUndoGroup(i18n._("Edit pins"));
            if (sideEditGroup.checked) setSide();
            if (locationEditGroup.checked) setLocation();
            if (colorEditGroup.checked) setColor();
            if (sizeEditGroup.checked) setSize();
            if (opacityEditGroup.checked) setOpacity();
            if (characterEditGroup.checked) setCharacterName();
            if (limbEditGroup.checked) setLimbName();
            pinsButton.optionsPopup.hide();
            DuAE.endUndoGroup();
        }

    }
    pinsButton.onClick = function() {
        if (!DuAEProject.setProgressMode(true, true, true, [pinsButton.screenX, pinsButton.screenY] )) return;
        Duik.Constraint.pin(false);
        DuAEProject.setProgressMode(false);
    };
    pinsButton.onAltClick = function() {
        if (!DuAEProject.setProgressMode(true, true, true, [pinsButton.screenX, pinsButton.screenY] )) return;
        Duik.Constraint.pin();
        DuAEProject.setProgressMode(false);
    };

    var line2 = DuScriptUI.group(constraintsGroup, uiMode >= 2 ? 'row' : 'column');

    var ikGroup = DuScriptUI.multiButton(
        line2,
        i18n._("Kinematics"),
        w16_ik_fk,
        i18n._("Create Inverse and Forward Kinematics.")
    );
    ikGroup.build = function() {
        var ikButton = this.addButton(
            i18n._("IK"),
            w16_ik,
            i18n._("Standard Inverse Kinematics."),
            true
        );
        var ikSelector;
        ikButton.optionsPopup.build = function() {
            ikSelector = DuScriptUI.selector(ikButton.optionsPanel);
            ikSelector.addButton(
                i18n._("1+2-layer IK"),
                w16_one_two_ik,
                i18n._("Create a one-layer IK combined with a two-layer IK\nto handle Z-shape limbs.")
            );
            ikSelector.addButton(
                i18n._("2+1-layer IK"),
                w16_two_one_ik,
                i18n._("Create a two-layer IK combined with a one-layer IK\nto handle Z-shape limbs.")
            );
            ikSelector.setCurrentIndex(1);
        }

        var bezierIKButton = this.addButton(
            i18n._("B\u00e9zier IK"),
            w16_bezier_ik,
            i18n._("B\u00e9zier Inverse Kinematics.")
        );

        var fkButton = this.addButton(
            i18n._("FK"),
            w16_fk,
            i18n._("Forward Kinematics\nwith automatic overlap and follow-through.")
        );

        var bezierFKButton = this.addButton(
            i18n._("B\u00e9zier FK"),
            w16_bezier_fk,
            i18n._("B\u00e9zier FK")
        );

        ikButton.onClick = function() {
            Duik.Constraint.ik(ikSelector.index + 1);
        };

        bezierIKButton.onClick = function() {
            Duik.Constraint.ik(undefined, true);
        };

        fkButton.onClick = Duik.Constraint.fk;

        bezierFKButton.onClick = function() {
            Duik.Constraint.ik(undefined, true, undefined, undefined, true);
        };
    }

    var parentGroup = DuScriptUI.multiButton(
        line2,
        i18n._("Parent"),
        w16_parent,
        i18n._("Create parent constraints.")
    );
    parentGroup.build = function() {
        var autoParentButton = this.addButton(
            i18n._("Auto-parent"),
            w16_auto_parent,
            i18n._("Parent all the selected layers to the last selected one.\n\n[Alt]: Parent only the orphans.\nOr:\n[Ctrl]: Parent layers as a chain, from ancestor to child, in the order of the selection.")
        );
        autoParentButton.onClick = Duik.Constraint.autoParent;
        autoParentButton.onAltClick = function() {
            Duik.Constraint.autoParent(true);
        };
        autoParentButton.onCtrlClick = function() {
            Duik.Constraint.autoParent(false, undefined, true);
        }

        var parentConstraintButton = this.addButton(
            i18n._("Parent constraint"),
            w16_parent,
            i18n._("Animatable parent.")
        );
        parentConstraintButton.onClick = Duik.Constraint.parent;

        var parentAcrossCompButton = this.addButton(
            i18n._("Parent across comps..."),
            w16_parent_across_comp,
            i18n._("Parent layers across compositions.")
        );
        parentAcrossCompButton.onClick = function() {
            // build panel
            if (!parentAcrossCompGroup.built) {

                var titleBar = createSubPanel(
                    parentAcrossCompGroup,
                    i18n._("Parent across comps"),
                    constraintsGroup
                );

                DuScriptUI.staticText(
                    parentAcrossCompGroup,
                    i18n._("Parent comp") + ':',
                    undefined,
                    false
                );

                var parentCompSelector = DuScriptUI.compSelector(
                    parentAcrossCompGroup
                );
                parentCompSelector.filterComps = DuAEComp.getRelatives;
                parentCompSelector.onChange = function() {
                    var comp = parentCompSelector.getComp();
                    if (!comp) return;
                    parentCompLayerSelector.comp = comp;
                    parentCompLayerSelector.refresh();
                }

                DuScriptUI.staticText(
                    parentAcrossCompGroup,
                    i18n._("Parent layer") + ':',
                    undefined,
                    false
                );

                var parentCompLayerSelector = DuScriptUI.layerSelector(
                    parentAcrossCompGroup
                );
                parentCompLayerSelector.onChange = function() {
                    if (parentCompLayerSelector.index > 0) parentCompValidButton.enabled = true;
                    else parentCompValidButton.enabled = false;
                }

                var parentCompValidButton = addValidButton (
                    parentAcrossCompGroup,
                    i18n._("Parent across comps"),
                    i18n._("Parent layers across compositions.")
                );

                parentCompValidButton.enabled = false;
                parentCompValidButton.onClick = function() {
                    //get comp and layer
                    var comp = parentCompSelector.getComp();
                    var layer = comp.layer(parentCompLayerSelector.index);

                    // We need the options of the extract locator button
                    extractLocatorButton.optionsPopup.build();

                    var useEssentialProperties = locatorModeSelector.index == 1;

                    Duik.Constraint.parentAcrossComp(layer, useEssentialProperties);

                    if (!titleBar.pinned) titleBar.onClose();
                }

                DuScriptUI.showUI(parentAcrossCompGroup);
            }

            hideAllGroups();
            parentAcrossCompGroup.visible = true;
        };
    }

    var transformGroup = DuScriptUI.multiButton(
        line2,
        i18n._("Transform"),
        w16_constraint,
        i18n._("Create transform constraints (position, orientation, path...).")
    );
    transformGroup.build = function() {
        var positionConstraintButton = this.addButton(
            i18n._("Position constraint"),
            w16_move,
            i18n._("Constraint the location of a layer to the position of other layers.")
        );
        positionConstraintButton.onClick = Duik.Constraint.position;

        var orientationConstraintButton = this.addButton(
            i18n._("Orientation constraint"),
            w16_rotate,
            i18n._("Constraint the orientation of a layer to the orientation of other layers.")
        );
        orientationConstraintButton.onClick = Duik.Constraint.orientation;

        var pathConstraintButton = this.addButton(
            i18n._("Path constraint") + '...',
            w16_bezier,
            i18n._("Constraint the location and orientation of a layer to a B\u00e9zier path.\n\n" + 
                    "[ALT]: Move the layer onto the path."),
            false,
            undefined,
            undefined,
            false
        );
        pathConstraintButton.onClick = function() {
            var pathProp = null;
            // Get path prop
            function pickPath() {
                pathProp = null;
                pathConstraintValidButton.enabled = false;
                pathConstraintLabel.text = i18n._("Pick path...");
                var props = DuAEComp.getSelectedProps(PropertyValueType.SHAPE);
                if (props.length == 0) return false;

                pathProp = props.pop();
                var parentProp = pathProp.getProperty().parentProperty;
                pathConstraintLabel.text = pathProp.layer.index + " - " + pathProp.layer.name + " # " + parentProp.name;
                pathConstraintValidButton.enabled = true;
            }

            // build panel
            if (!pathConstraintGroup.built) {

                var titleBar = createSubPanel(
                    pathConstraintGroup,
                    i18n._("Path constraint"),
                    constraintsGroup
                );

                var pathGroup = DuScriptUI.group(pathConstraintGroup, 'row');

                pathConstraintLabel = DuScriptUI.staticText(pathGroup, i18n._("Pick path..."));
                pathConstraintLabel.alignment = ['fill', 'center'];

                var pickPathButton = DuScriptUI.button(
                    pathGroup,
                    '',
                    DuScriptUI.Icon.EYE_DROPPER_BIG,
                    i18n._("Pick path...")
                );
                pickPathButton.alignment = ['right', 'center'];
                pickPathButton.onClick = pickPath;

                pathConstraintValidButton = addValidButton (
                    pathConstraintGroup,
                    i18n._("Path constraint"),
                    i18n._("Constraint the location and orientation of a layer to a B\u00e9zier path.\n\n" + 
                            "[ALT]: Move the layer onto the path.")
                );
                pathConstraintValidButton.enabled = false;
                pathConstraintValidButton.onClick = function() {
                    Duik.Constraint.path(pathProp);
                    if (!titleBar.pinned) titleBar.onClose();
                }
                pathConstraintValidButton.onAltClick = function() {
                    Duik.Constraint.path(pathProp, undefined, true);
                    if (!titleBar.pinned) titleBar.onClose();
                }

                DuScriptUI.showUI(pathConstraintGroup);
            }

            // we can create
            if (Duik.Constraint.path()) return;

            // ask for the path
            hideAllGroups();
            pathConstraintGroup.visible = true;
            pickPath();
        };
    }

    var parentAcrossCompGroup = DuScriptUI.group(mainGroup, 'column');
    parentAcrossCompGroup.visible = false;
    parentAcrossCompGroup.built = false;

    var pathConstraintValidButton;
    var pathConstraintLabel;
    var pathConstraintGroup = DuScriptUI.group(mainGroup, 'column');
    pathConstraintGroup.visible = false;
    pathConstraintGroup.built = false;

    var measureText;
    var measureValidButton;
    var measureGroup = DuScriptUI.group(mainGroup, 'column');
    measureGroup.visible = false;
    measureGroup.built = false;

    var propInfoGroup = DuScriptUI.group(mainGroup, 'column');
    propInfoGroup.visible = false;
    propInfoGroup.built = false;

    var moveAnchorPointGroup = DuScriptUI.group(mainGroup, 'column');
    moveAnchorPointGroup.visible = false;
    moveAnchorPointGroup.built = false;

    var connectorGroup = DuScriptUI.group(mainGroup, 'column');
    connectorGroup.visible = false;
    connectorGroup.built = false;

    var effectorMapGroup = DuScriptUI.group(mainGroup, 'column');
    effectorMapGroup.visible = false;
    effectorMapGroup.built = false;
}