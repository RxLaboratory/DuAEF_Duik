// ==================== |-------------------| ====================
// ==================== | Duik16_api-simple | ====================
// ==================== |-------------------| ====================

// ==================== |-------------------| ====================
// ==================== | Duik16_api-header | ====================
// ==================== |-------------------| ====================

/**
 * To use the Duik API, just include the API file in the beginning of your script.<br />
 * Most of the methods work without any parameter but use the context (the active composition, the selected layers and properties).<br />
 * If you need lower-level methods, for example being able to set an IK on specific layers or to wiggle specific properties,<br />
 * you should use the {@link http://duaef-docs.rainboxlab.org/ | DuAEF Framework} - Duduf After Effects Framework, which Duik is based on.<br />
 * A {@link http://duaef-reference.rainboxlab.org/ | complete reference of this framework is available here}.<br />
 * The API is contained in the <code>Duik</code> object, and DuAEF is also made available in the <code>DuAEF</code> object.<br />
 * @example
 * //encapsulate everything to avoid global variables !important!
 * (function(thisObj) {
 *     //include the API
 *     #include 'Duik16_api.jsxinc'
 *     
 *     // Create a hominoid structure
 *     // The whole API is contained in the DuAEF_DUIK object
 *     // but the DuAEF framework is also made available in its own object
 *     Duik.structures.mammal();
 *  })(this);
 * @overview Duik Application Programming Interface.
 * @author Nicolas Dufresne and contributors
 * @copyright 2017 - 2019 Nicolas Dufresne, Rainbox Productions
 * @version 16.1
 * @license GPL-3.0 <br />
 * Duik is free software: you can redistribute it and/or modify<br />
 * it under the terms of the GNU General Public License as published by<br />
 * the Free Software Foundation, either version 3 of the License, or<br />
 * (at your option) any later version.<br />
 *<br />
 * Duik is distributed in the hope that it will be useful,<br />
 * but WITHOUT ANY WARRANTY; without even the implied warranty of<br />
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the<br />
 * GNU General Public License for more details.<br />
 *<br />
 * You should have received a copy of the GNU General Public License<br />
 * along with Duik. If not, see {@link http://www.gnu.org/licenses/}.
 * @namespace
 */
var Duik = {};

// ==================== |----------------| ====================
// ==================== | Duik16_license | ====================
// ==================== |----------------| ====================

/*
	Duik - Duduf IK Tools

	Copyright (c) 2008 - 2017 Nicolas Dufresne, Rainbox Productions

	https://rainboxprod.coop

	__Contributors:__

		Nicolas Dufresne - Lead developer
		Kevin Masson - Developer

	__Translations:__

		eZioPan – Simplified Chinese
		Ana Arce – Spanish
		Adam Szczepański – Polish

	__Thanks to:__

		Dan Ebberts - Writing the first IK Expressions
		Eric Epstein - making the IK's work with 3D Layers
		Kevin Schires – Including images in the script
		Matias Poggini – Bezier IK feature
		Eric Epstein - Making the IK's work with 3D Layers
		Assia Chioukh and Quentin Saint-Georges – User Guides composition
		Motion Cafe – Ideas and feedback
		Fous d’anim – Ideas and feedback
		All 258 Duik 15 indiegogo backers for making this libDuik possible!

	__Duik makes use of:__

		• x2js
		Copyright (c) 2011-2013 Abdulla Abdurakhmanov
		Original sources are available at https://code.google.com/p/x2js/
		Licensed under the Apache License, Version 2.0

		• json2
		See http://www.JSON.org/js.html
		Public Domain

		• seedRandom
		Copyright (c) David Bau
		Licensed under the MIT license

		• FFMpeg
		See http://ffmpeg.org

		• DuFFMpeg
		Copyright (c) 2017 Nicolas Dufresne and Rainbox Productions
		Sources available at https://github.com/Rainbox-dev/DuFFMpeg
		Licensed under the GNU General Public License v3

	This file is part of Duik.

		Duik is free software: you can redistribute it and/or modify
		it under the terms of the GNU General Public License as published by
		the Free Software Foundation, either version 3 of the License, or
		(at your option) any later version.

		Duik is distributed in the hope that it will be useful,
		but WITHOUT ANY WARRANTY; without even the implied warranty of
		MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
		GNU General Public License for more details.

		You should have received a copy of the GNU General Public License
		along with Duik. If not, see <http://www.gnu.org/licenses/>.

*/// ==================== |---------------------| ====================
// ==================== | Duik16_api_required | ====================
// ==================== |---------------------| ====================

var standAlone = true;

//create a settings object
var settingsFile;
if (app.settings.haveSetting(DuAEF.scriptName,"settingsFile")) settingsFile = new File(app.settings.getSetting(DuAEF.scriptName,"settingsFile"));
var settings = new DuSettings(DuAEF.scriptName,settingsFile);// ==================== |----------------------| ====================
// ==================== | Duik16_api-functions | ====================
// ==================== |----------------------| ====================

// ==================== |-----------------------------| ====================
// ==================== | Duik16_automation_functions | ====================
// ==================== |-----------------------------| ====================

/**
 * Duik {@link http://duaef-docs.rainboxlab.org/Guides/Duik/automations.html | Automations}<br />
 * Read the {@link http://duik-docs.rainboxlab.org | Duik User Guide} > {@link http://duaef-docs.rainboxlab.org/Guides/Duik/automations.html | Automations} for more information about each method.<br />
 * <code>#include 'Duik16_automation_functions.jsxinc'</code>
 * @namespace
 */
Duik.automation = {}

/**
 * All the automation methods stored as objects which can be parsed easily, for example to automatically build a ui with a button for each method.
 * @property {string} name - A display name for the method
 * @property {string} fn - The source script to eval
 */
Duik.automation.functions = []

//The functions

Duik.automation.functions.push( { name:"Effector", fn:"Duik.automation.effector()" } );
/**
 * Creates an Effector
 * @param {Layer} [effectorLayer] - An optional pre-existing effector
 */
Duik.automation.effector = function ( effectorLayer )
{
    var comp = DuAEF.DuAE.Project.getActiveComp();
    if (!comp) return;

    effectorLayer = def( effectorLayer, DuAEF.Duik.getLayer(DuAEF.Duik.LayerTypes.EFFECTOR,true) );

    DuAEF.DuAE.App.beginUndoGroup( "Effector" );

	var effector = {};

	//Check if there already is an effector in the selection
	effector.effectorLayer = effectorLayer;

	var layers = DuAEF.DuAE.Comp.unselectLayers();
	if (layers.length == 0) return;

	var it = new Iterator(layers);
	it.do(function (layer)
	{
		effector.effect = null;
		for ( var j = 0 ; j < layer.props.length ; j++)
		{
			effector = DuAEF.Duik.Automation.effector(layer.props[j],effector.effect,effector.effectorLayer);
		}
	});

    if (effector) if (effector.effectorLayer) effector.effectorLayer.selected = true;

	DuAEF.DuAE.App.endUndoGroup();
}

Duik.automation.functions.push( { name:"Wiggle", fn:"Duik.automation.wiggle()" } );
/**
 * Wiggle
 * @param {boolean} [separateDimensions=false] - Wether to separate the dimensions to wiggle them with a different random seed.
 * @param {boolean} [unifiedControl=true] - Wether to add a single control for all properties, or one for each
 */
Duik.automation.wiggle = function ( separateDimensions, unifiedControl )
{
    separateDimensions = def ( separateDimensions, false );
    unifiedControl = def ( unifiedControl, true );

    var props = DuAEF.DuAE.Comp.getSelectedProps();
    if (props.length == 0) return;

    DuAEF.DuAE.App.beginUndoGroup("Wiggle");

    var effect = null;

    var layers = DuAEF.DuAE.Comp.unselectLayers();
    for (var i = 0 ; i < props.length ; i++)
    {
        if ( !unifiedControl ) DuAEF.Duik.Automation.wiggle(props[i], separateDimensions );
        else effect = DuAEF.Duik.Automation.wiggle(props[i], separateDimensions ,effect);
    }
    DuAEF.DuAE.Comp.selectLayers(layers);


    DuAEF.DuAE.App.endUndoGroup();
}

Duik.automation.functions.push( { name:"Spring", fn:"Duik.automation.spring()" } );
/**
 * Spring
 */
Duik.automation.spring = function (  )
{
    var props = DuAEF.DuAE.Comp.getSelectedProps();
    if (props.length == 0) return;

    DuAEF.DuAE.App.beginUndoGroup("Spring");

    var layers = DuAEF.DuAE.Comp.unselectLayers();
    for (var i = 0 ; i < props.length ; i++)
    {
        DuAEF.Duik.Automation.spring(props[i]);
    }
    DuAEF.DuAE.Comp.selectLayers(layers);

    DuAEF.DuAE.App.endUndoGroup();
}

Duik.automation.functions.push( { name:"Swing", fn:"Duik.automation.swing()" } );
/**
 * Swing
 */
Duik.automation.swing = function (  )
{
    var props = DuAEF.DuAE.Comp.getSelectedProps();
    if (props.length == 0) return;

    DuAEF.DuAE.App.beginUndoGroup("Swing");

    var layers = DuAEF.DuAE.Comp.unselectLayers();
    for (var i = 0 ; i < props.length ; i++)
    {
        DuAEF.Duik.Automation.swing(props[i]);
    }
    DuAEF.DuAE.Comp.selectLayers(layers);

    DuAEF.DuAE.App.endUndoGroup();
}

Duik.automation.functions.push( { name:"Blink", fn:"Duik.automation.blink()" } );
/**
 * Blink
 */
Duik.automation.blink = function (  )
{
    var props = DuAEF.DuAE.Comp.getSelectedProps();
    if (props.length == 0) return;

    DuAEF.DuAE.App.beginUndoGroup("Blink");

    var layers = DuAEF.DuAE.Comp.unselectLayers();
    for (var i = 0 ; i < props.length ; i++)
    {
        DuAEF.Duik.Automation.blink(props[i]);
    }
    DuAEF.DuAE.Comp.selectLayers(layers);

    DuAEF.DuAE.App.endUndoGroup();
}

Duik.automation.functions.push( { name:"Wheel", fn:"Duik.automation.wheel()" } );
/**
 * Wheel
 */
Duik.automation.wheel = function (  )
{
    var comp = DuAEF.DuAE.Project.getActiveComp();
    if (!comp) return;

    DuAEF.DuAE.App.beginUndoGroup("Wheel");

    var layers = DuAEF.DuAE.Comp.unselectLayers();
    for (var i = 0; i<layers.length ; i++)
    {
        DuAEF.Duik.Automation.wheel(layers[i]);
    }
    DuAEF.DuAE.Comp.selectLayers(layers);

    DuAEF.DuAE.App.endUndoGroup();
}

Duik.automation.functions.push( { name:"Move Away", fn:"Duik.automation.moveAway()" } );
/**
 * Move Away
 */
Duik.automation.moveAway = function (  )
{
    var comp = DuAEF.DuAE.Project.getActiveComp();
    if (!comp) return;

    DuAEF.DuAE.App.beginUndoGroup("Move Away");

    var layers = DuAEF.DuAE.Comp.unselectLayers();
    for (var i = 0; i<layers.length ; i++)
    {
        DuAEF.Duik.Automation.moveAway(layers[i]);
    }
    DuAEF.DuAE.Comp.selectLayers(layers);

    DuAEF.DuAE.App.endUndoGroup();
}

Duik.automation.functions.push( { name:"Paint Rig", fn:"Duik.automation.paintRig()" } );
/**
 * Paint Rig
 */
Duik.automation.paintRig = function (  )
{
    var comp = DuAEF.DuAE.Project.getActiveComp();
    if (!comp) return;

    DuAEF.DuAE.App.beginUndoGroup("Paint Rig");

    var layers = DuAEF.DuAE.Comp.unselectLayers();
    for (var i = 0; i<layers.length ; i++)
    {
        DuAEF.Duik.Automation.paintRig(layers[i]);
    }
    DuAEF.DuAE.Comp.selectLayers(layers);

    DuAEF.DuAE.App.endUndoGroup();
}

Duik.automation.functions.push( { name:"Walk Cycle", fn:"Duik.automation.walk()" } );
/**
 * Procedural Walk Cycle<br />
 * The method in the Duik API only automatically creates walk cycles with selected Duik Controllers.<br />
 * To create a walk cycle on a custom rig, or a character rigged with another script/extension, use the {@link http://duaef-docs.rainboxlab.org/Framework-Reference/DuAEF.Duik.Automation.html#.walk | DuAEF API} instead with its lower level methods.
 */
Duik.automation.walk = function ( )
{
    var ctrls = DuAEF.Duik.Controller.getControllers(undefined,true);

    DuAEF.DuAE.App.beginUndoGroup("Walk cycle");

    DuAEF.DuAE.Project.setProgressMode(true);

    DuAEF.Duik.Automation.autoWalk(ctrls);

    DuAEF.DuAE.Project.setProgressMode(false);

    DuAEF.DuAE.App.endUndoGroup();    
}

Duik.automation.functions.push( { name:"Looper", fn:"Duik.automation.loop()" } );
/**
 * Looper
 */
Duik.automation.loop = function ( )
{
    var props = DuAEF.DuAE.Comp.getSelectedProps();
    if (props.length == 0) return;

    var effect = null;

    DuAEF.DuAE.App.beginUndoGroup("Looper");

    var itProps = new Iterator(props);
    itProps.do(function(prop)
    {
        effect = DuAEF.Duik.Automation.loop(prop,effect);
    });

    DuAEF.DuAE.App.endUndoGroup();
}// ==================== |------------------------------| ====================
// ==================== | Duik16_constraints_functions | ====================
// ==================== |------------------------------| ====================

/**
 * Duik {@link http://duaef-docs.rainboxlab.org/Guides/Duik/constraints.html | Constraints}<br />
 * Read the {@link http://duik-docs.rainboxlab.org | Duik User Guide} > {@link http://duaef-docs.rainboxlab.org/Guides/Duik/constraints.html | Constraints} for more information about each method.<br />
 * <code>#include 'Duik16_constraints_functions.jsxinc'</code>
 * @namespace
 */
Duik.constraints = {}

/**
 * All the constraints methods stored as objects which can be parsed easily, for example to automatically build a ui with a button for each method.
 * @property {string} name - A display name for the method
 * @property {string} fn - The source script to eval
 */
Duik.constraints.functions = []

//The functions

Duik.constraints.functions.push( { name:"Auto-rig & IK", fn:"Duik.constraints.autorig()" } );
/**
 * Auto-Rig & IK
 * @param {boolean} [bakeStructures=true] - Wether to bake the structures after the Auto-rig has completed. Improves performance.
 */
Duik.constraints.autorig = function ( bakeStructures )
{
    bakeStructures = def ( bakeStructures, true );

    var layers = DuAEF.DuAE.Comp.unselectLayers();
    if ( layers.length == 0 ) return;

    DuAEF.DuAE.App.beginUndoGroup( "Autorig" );

    DuAEF.DuAE.Project.setProgressMode( true );

    DuAEF.Duik.Autorig.rig( layers, settings.data.autorigTailIK, !settings.data.ik3Layer );

    if ( bakeStructures )
    {
        var structure = new Structure( layers );
        structure.bakeAppearence();
    }

    DuAEF.DuAE.Project.setProgressMode( false );

    DuAEF.DuAE.App.endUndoGroup();
}

Duik.constraints.functions.push( { name:"Connector", fn:"Duik.constraints.quickConnector()" } );
/**
 * Quick Connector
 */
Duik.constraints.quickConnector = function ()
{
    var props = DuAEF.DuAE.Comp.getSelectedProps();
    if ( props.length == 0 ) return;

    DuAEF.DuAE.App.beginUndoGroup("Connector" );
    DuAEF.Duik.Rigging.quickConnector( props );
    DuAEF.DuAE.App.endUndoGroup();
}

Duik.constraints.functions.push( { name:"Bones", fn:"Duik.constraints.bones()" } );
/**
 * Add bones
 * @param {boolean} [randomColor=false] - Wether to assign a random color to the bones
 * @param {boolean} [tangents=true] - Wether to create bones for the tangents in case the selected property is a Bézier path
 */
Duik.constraints.bones = function ( randomColor, tangents )
{
    randomColor = def( randomColor, false );
    tangents = def( tangents, true );

    var props = DuAEF.DuAE.Comp.getSelectedProps();

    //just create a single bone without any prop
    if (props.length == 0)
    {
        DuAEF.DuAE.App.beginUndoGroup( "Create bones" );

        var bone = DuAEF.Duik.Bone.createBone();
        bone.layer.selected = true;

        DuAEF.DuAE.App.endUndoGroup();

        return;
    }

    DuAEF.DuAE.App.beginUndoGroup( "Create bones" );

    DuAEF.DuAE.Project.setProgressMode( true );

    if ( randomColor ) DuAEF.Duik.Bone.color = DuAEF.DuJS.Color.random();
    else if (settings.data.boneColor) DuAEF.Duik.Bone.color = DuAEF.DuJS.Color.hexToRGB( settings.data.boneColor );
    var bones = [];
    var itProps = new Iterator( props );
    itProps.do( function( prop )
    {
        bones = bones.concat( DuAEF.Duik.Bone.addBone( prop, undefined, tangents ) );
    } );

    //if nothing was created
    if ( bones.length == 0 )
    {
        var layers = DuAEF.DuAE.Comp.getSelectedLayers();
        var itLayers = new Iterator( layers );

        //Try to find puppet pins
        itLayers.do( function( layer )
        {
            var pins = DuAEF.DuAE.Layer.getPuppetPins( layer );
            var itPins = new Iterator( pins );
            itPins.do( function( pin )
            {
                bones.push( DuAEF.Duik.Bone.addBone( pin, undefined, tangents ) );
            } );
        } );

        //Try any spatial property
        if ( bones.length == 0 )
        {
            itProps.do( function( prop )
            {
                bones = bones.concat( DuAEF.Duik.Bone.addBones( prop, undefined, tangents ) );
            } );
        }

    }

    DuAEF.DuAE.Comp.selectLayers( bones );

    DuAEF.DuAE.Project.setProgressMode( false );

    DuAEF.DuAE.App.endUndoGroup();
}

Duik.constraints.functions.push( { name:"Quick Parent", fn:"Duik.constraints.autoParent()" } );
/**
 * Auto-Parent
 */
Duik.constraints.autoParent = function ( )
{
    var layers = DuAEF.DuAE.Comp.getSelectedLayers();
    DuAEF.DuAE.App.beginUndoGroup( "Auto-parent layers" );
    DuAEF.DuAE.Layer.parent( layers );
    DuAEF.DuAE.App.endUndoGroup();
}

Duik.constraints.functions.push( { name:"Parent Constraint", fn:"Duik.constraints.parentConstraint()" } );
/**
 * Parent Constraint
 */
Duik.constraints.parentConstraint = function ( )
{
    var layers = DuAEF.DuAE.Comp.unselectLayers();
    if ( layers.length == 0 ) return;

    DuAEF.DuAE.App.beginUndoGroup( "Parent link" );
    for ( var i = 0; i < layers.length; i++ )
    {
        DuAEF.Duik.Rigging.parentConstraint( layers[ i ] );
    }
    DuAEF.DuAE.Comp.selectLayers( layers );
    DuAEF.DuAE.App.endUndoGroup();
}

Duik.constraints.functions.push( { name:"Path Constraint", fn:"Duik.constraints.pathConstraint()" } );
/**
 * Path Constraint
 * @param {Property} [path] - The path to use to constrain the selected layers.<br />
 * If undefined, Duik will use the first path selected on the last selected layer.
 * @return {boolean} True if a constraint was created, false if no path was found and nothing has been done
 */
Duik.constraints.pathConstraint = function ( path )
{
    var comp = DuAEF.DuAE.Project.getActiveComp();
    if ( !comp ) return false;

    var layers = comp.selectedLayers;

    if ( typeof path === 'undefined' && layers.length < 2) return false; 

    if ( typeof path === 'undefined' ) 
    {
        var pathLayer = layers.pop();
        var pathProps = DuAEF.DuAE.Layer.getSelectedProps( pathLayer, PropertyValueType.SHAPE )
        if (pathProps.length == 0) return false;
        path = pathProps.pop();
    }

    DuAEF.DuAE.App.beginUndoGroup( "Path constraint" );
    var it = new Iterator(layers);
    it.do(function (layer) {
        DuAEF.Duik.Rigging.pathConstraint( layer, path );
    });

    DuAEF.DuAE.App.endUndoGroup();

    return true;
}

Duik.constraints.functions.push( { name:"Position Constraint", fn:"Duik.constraints.positionConstraint()" } );
/**
 * Position Constraint
 */
Duik.constraints.positionConstraint = function ( )
{
    var layers = DuAEF.DuAE.Comp.unselectLayers();
    if ( layers.length == 0 ) return;

    DuAEF.DuAE.App.beginUndoGroup( "Orientation Constraint" );
    for ( var i = 0; i < layers.length; i++ )
    {
        DuAEF.Duik.Rigging.positionConstraint( layers[ i ] );
    }
    DuAEF.DuAE.Comp.selectLayers( layers );
    DuAEF.DuAE.App.endUndoGroup();
}

Duik.constraints.functions.push( { name:"Orientation Constraint", fn:"Duik.constraints.orientationConstraint()" } );
/**
 * Orientation Constraint
 */
Duik.constraints.orientationConstraint = function ( )
{
    var layers = DuAEF.DuAE.Comp.unselectLayers();
    if ( layers.length == 0 ) return;

    DuAEF.DuAE.App.beginUndoGroup( "Orientation Constraint" );
    for ( var i = 0; i < layers.length; i++ )
    {
        DuAEF.Duik.Rigging.orientationConstraint( layers[ i ] );
    }
    DuAEF.DuAE.Comp.selectLayers( layers );
    DuAEF.DuAE.App.endUndoGroup();
}

Duik.constraints.functions.push( { name:"List", fn:"Duik.constraints.list()" } );
/**
 * List
 */
Duik.constraints.list = function ( )
{
    var props = DuAEF.DuAE.Comp.getSelectedProps();
	if (props.length == 0) return;

	DuAEF.DuAE.App.beginUndoGroup( "List" );

	var layers = DuAEF.DuAE.Comp.unselectLayers();
	for (var i = 0 ; i < props.length ; i++)
	{
		DuAEF.Duik.Automation.list(props[i]);
	}
	DuAEF.DuAE.Comp.selectLayers(layers);

	DuAEF.DuAE.App.endUndoGroup();
}

Duik.constraints.functions.push( { name:"Expose Transform", fn:"Duik.constraints.exposeTransform()" } );
/**
 * Expose Transform
 */
Duik.constraints.exposeTransform = function ( )
{
    var comp = DuAEF.DuAE.Project.getActiveComp();
    if (!comp) return;

    DuAEF.DuAE.App.beginUndoGroup("Expose Transform");

    var layers = DuAEF.DuAE.Comp.unselectLayers();
    var ctrls = [];
    if (layers.length == 0) ctrls.push(DuAEF.Duik.Rigging.exposeTransform(comp));
    else
    {
        for (var  i = 0, num = layers.length ; i < num ; i++)
        {
            var ctrl = DuAEF.Duik.Rigging.exposeTransform(comp,layers[i]);
            ctrls.push(ctrl);
        }
    }

    DuAEF.DuAE.Comp.selectLayers(ctrls);

    DuAEF.DuAE.App.endUndoGroup();
}

Duik.constraints.functions.push( { name:"Zero", fn:"Duik.constraints.zero()" } );
/**
 * Add Zero
 */
Duik.constraints.zero = function ( )
{
    DuAEF.DuAE.Comp.doSelectedLayers( DuAEF.Duik.Rigging.addZero, "Add zero" );
}

Duik.constraints.functions.push( { name:"Reset Transform (PRS)", fn:"Duik.constraints.resetPRS()" } );
/**
 * Reset Transform (set to Zero)
 */
Duik.constraints.resetPRS = function ( )
{
    DuAEF.DuAE.Comp.doSelectedLayers( DuAEF.Duik.Animation.resetPRS, "Reset PRS" );
}

Duik.constraints.functions.push( { name:"Lock Property", fn:"Duik.constraints.lockProperty()" } );
/**
 * Lock Property
 */
Duik.constraints.lockProperty = function ( )
{
    var props = DuAEF.DuAE.Comp.getSelectedProps();
    if ( props.length == 0 ) return;

    DuAEF.DuAE.App.beginUndoGroup( "Lock properties" );

    DuAEF.DuAE.Property.lock( props );

    DuAEF.DuAE.App.endUndoGroup();
}

Duik.constraints.functions.push( { name:"Separate Dimensions", fn:"Duik.constraints.separateDimensions()" } );
/**
 * Separate Dimensions
 */
Duik.constraints.separateDimensions = function ( )
{
    var props = DuAEF.DuAE.Comp.getSelectedProps();
    if ( props.length == 0 ) return;

    DuAEF.DuAE.App.beginUndoGroup( "Separate dimensions" );

    for ( var i = 0, num = props.length; i < num; i++ )
    {
        DuAEF.Duik.Rigging.separateDimensions( props[ i ] );
    }

    DuAEF.DuAE.App.endUndoGroup();
}

Duik.constraints.functions.push( { name:"Locator", fn:"Duik.constraints.locator()" } );
/**
 * Add Locator
 */
Duik.constraints.locator = function ( )
{
     var layers = DuAEF.DuAE.Comp.getSelectedLayers();

    DuAEF.DuAE.App.beginUndoGroup( "Add Locator(s)" );

    if ( layers.length )
    {
        new Iterator( layers ).do( function( layer )
        {
            DuAEF.Duik.Rigging.addLocator( layer );
        } );
    }
    else
    {
        DuAEF.Duik.Rigging.addLocator();
    }

    DuAEF.DuAE.App.endUndoGroup();
}

Duik.constraints.functions.push( { name:"Extract Locators", fn:"Duik.constraints.extractLocators()" } );
/**
 * Extract Locators
 */
Duik.constraints.extractLocators = function ( )
{
    var layers = DuAEF.DuAE.Comp.getSelectedLayers();
    if ( layers.length == 0 ) return;

    DuAEF.DuAE.App.beginUndoGroup( "Extract Locators" );

    new Iterator( layers ).do( function( layer )
    {
        DuAEF.Duik.Rigging.extractLocators( layer );
    } );

    DuAEF.DuAE.App.endUndoGroup();
}// ==================== |-----------------------------| ====================
// ==================== | Duik16_structures_functions | ====================
// ==================== |-----------------------------| ====================

/**
 * Duik {@link http://duaef-docs.rainboxlab.org/Guides/Duik/structures.html | Structures}<br />
 * Read the {@link http://duik-docs.rainboxlab.org | Duik User Guide} > {@link http://duaef-docs.rainboxlab.org/Guides/Duik/structures.html | Structures} for more information about each method.<br />
 * <code>#include 'Duik16_structures_functions.jsxinc'</code>
 * @namespace
 */
Duik.structures = {}

/**
 * All the structure methods stored as objects which can be parsed easily, for example to automatically build a ui with a button for each method.
 * @property {string} name - A display name for the method
 * @property {string} fn - The source script to eval
 */
Duik.structures.functions = []

//The functions

//TODO adjust autorig for animals/quadrupeds
Duik.structures.functions.push( { name:"Hominoid", fn:"Duik.structures.mammal()" } );
Duik.structures.functions.push( { name:"Digitigrade", fn:"Duik.structures.mammal( DuAEF.Duik.Autorig.AnimalTypes.DIGITIGRADE )" } );
Duik.structures.functions.push( { name:"Ungulate", fn:"Duik.structures.mammal( DuAEF.Duik.Autorig.AnimalTypes.Ungulate )" } );
Duik.structures.functions.push( { name:"Plantigrade", fn:"Duik.structures.mammal( DuAEF.Duik.Autorig.AnimalTypes.PLANTIGRADE , 2, 1, true, true, true, true, true, true, true)" } );
/**
 * Creates a structure for a mammal
 * @param {DuAEF.Duik.Autorig.AnimalTypes} [type=DuAEF.Duik.Autorig.AnimalTypes.PLANTIGRADE] - One of DuAEF.Duik.Autorig.AnimalTypes.PLANTIGRADE, DuAEF.Duik.Autorig.AnimalTypes.DIGITIGRADE, DuAEF.Duik.Autorig.AnimalTypes.UNGULATE. See the {@link http://duaef-reference.rainboxlab.org/ | DuAEF Reference}
 * @param {int} [numSpine=2] - The number of structure elements for the spine
 * @param {int} [numNeck=1] - The number of structure elements for the neck
 * @param {boolean} [head=true] - Wether to add a structure element for a head
 * @param {boolean} [shoulder=true] - Wether to add a structure element for shouders
 * @param {boolean} [humerus=true] - Wether to add a structure element for humerus
 * @param {boolean} [radius=true] - Wether to add a structure element for radius
 * @param {boolean} [hand=true] - Wether to add a structure element for hands
 * @param {boolean} [frontClaws=false] - Wether to add a structure element for frontClaws. True by default if the structure is not for a Plantigrade.
 * @param {boolean} [femur=true] - Wether to add a structure element for femurs
 * @param {boolean} [tibia=true] - Wether to add a structure element for tibias
 * @param {boolean} [foot=true] - Wether to add a structure element for feet
 * @param {boolean} [backClaws=false] - Wether to add a structure element for backClaws. True by default if the structure is not for a Plantigrade.
 * @return {Array} An array containing two arrays: the first one is the list of Structure objects created (see the {@link http://duaef-reference.rainboxlab.org/ | DuAEF Reference}), the second one is the list of the new layers.
 */
Duik.structures.mammal = function (type, numSpine, numNeck, hips, head, shoulder, humerus, radius, hand, frontClaws, femur, tibia, foot, backClaws)
{
    //defaults
    type = def( type, DuAEF.Duik.Autorig.AnimalTypes.PLANTIGRADE );
    numSpine = def( numSpine, 2);
    numNeck = def( numNeck, 1);
    hips = def( hips, true);
    head = def( head, true);

    shoulder = def( shoulder, true );
    humerus = def( humerus, true );
    radius = def( radius, true );
    hand = def( hand, true );
    if ( type == def( type, DuAEF.Duik.Autorig.AnimalTypes.PLANTIGRADE ) )
    {
        frontClaws = def( frontClaws, false);
    }
    else
    {
        frontClaws = def( frontClaws, true);
    }
    

    femur = def( femur, true );
    tibia = def( tibia, true );
    foot = def( foot, true );
    backClaws = def( backClaws, true );


    var comp = DuAEF.DuAE.Project.getActiveComp();
    if ( !comp ) return [];

    var sizeUnit = comp.height / 12;

    DuAEF.DuAE.App.beginUndoGroup( "Create hominoid structure" );
    DuAEF.DuAE.Project.setProgressMode( true );

    var structureLayers = [];
    var structures = [];

    //SPINE
    var originPos = [ comp.width / 2, comp.height / 2 + sizeUnit ];
    var structure = DuAEF.Duik.Structure.createSpine( hips, numSpine, numNeck, head, undefined, originPos );
    structure = structure[ 0 ];
    structureLayers = structureLayers.concat( structure.elements );
    structures.push( structure );
    DuAEF.DuAE.Comp.unselectLayers( comp );
    //LEFT ARM
    originPos = [ comp.width / 2 - sizeUnit, 4 * sizeUnit ];
    if ( shoulder ) originPos = [ comp.width / 2 - sizeUnit / 2, 4 * sizeUnit ];
    structure = DuAEF.Duik.Structure.createArm( shoulder, humerus, radius, hand, false, undefined, type, undefined, originPos );
    structure = structure[ 0 ];
    structureLayers = structureLayers.concat( structure.elements );
    structures.push( structure );
    DuAEF.DuAE.Comp.unselectLayers( comp );
    //RIGHT ARM
    originPos = [ comp.width / 2 + sizeUnit, 4 * sizeUnit ];
    if ( shoulder ) originPos = [ comp.width / 2 + sizeUnit / 2, 4 * sizeUnit ];
    structure = DuAEF.Duik.Structure.createArm( shoulder, humerus, radius, hand, false, undefined, type, undefined, originPos, true );
    structure = structure[ 0 ];
    structureLayers = structureLayers.concat( structure.elements );
    structures.push( structure );
    DuAEF.DuAE.Comp.unselectLayers( comp );
    //LEFT LEG
    originPos = [ comp.width / 2 - sizeUnit / 2, comp.height / 2 + sizeUnit ];
    structure = DuAEF.Duik.Structure.createLeg( femur, tibia, foot, backClaws, undefined, type, undefined, originPos );
    structure = structure[ 0 ];
    structureLayers = structureLayers.concat( structure.elements );
    structures.push( structure );
    DuAEF.DuAE.Comp.unselectLayers( comp );
    //RIGHT LEG
    originPos = [ comp.width / 2 + sizeUnit / 2, comp.height / 2 + sizeUnit ];
    structure = DuAEF.Duik.Structure.createLeg( femur, tibia, foot, backClaws, undefined, type, undefined, originPos );
    structure = structure[ 0 ];
    structureLayers = structureLayers.concat( structure.elements );
    structures.push( structure );

    DuAEF.DuAE.App.endUndoGroup( );
    DuAEF.DuAE.Project.setProgressMode(false);

    return [structures, structureLayers];
}

Duik.structures.functions.push( { name:"Arm", fn:"Duik.structures.arm()" } );
Duik.structures.functions.push( { name:"Arm_Digitigrade", fn:"Duik.structures.arm(DuAEF.Duik.Autorig.AnimalTypes.DIGITIGRADE)" } );
Duik.structures.functions.push( { name:"Arm_Ungulate", fn:"Duik.structures.arm(DuAEF.Duik.Autorig.AnimalTypes.UNGULATE)" } );
Duik.structures.functions.push( { name:"Arm_Plantigrade", fn:"Duik.structures.arm(DuAEF.Duik.Autorig.AnimalTypes.PLANTIGRADE, true, true, true, true, true)" } );
/**
 * Creates a structure for an arm/front leg.
 * @param {DuAEF.Duik.Autorig.AnimalTypes} [type=DuAEF.Duik.Autorig.AnimalTypes.PLANTIGRADE] - One of DuAEF.Duik.Autorig.AnimalTypes.PLANTIGRADE, DuAEF.Duik.Autorig.AnimalTypes.DIGITIGRADE, DuAEF.Duik.Autorig.AnimalTypes.UNGULATE. See the {@link http://duaef-reference.rainboxlab.org/ | DuAEF Reference}
 * @param {boolean} [shoulder=true] - Wether to add a structure element for the shouder
 * @param {boolean} [humerus=true] - Wether to add a structure element for the humerus
 * @param {boolean} [radius=true] - Wether to add a structure element for the radius
 * @param {boolean} [hand=true] - Wether to add a structure element for the hand
 * @param {boolean} [frontClaws=false] - Wether to add a structure element for the front claws. True by default if the structure is not for a Plantigrade.
 * @param {boolean} [forceLink=false] - Wether link the selected layers/properties to the new structures
 */
Duik.structures.arm = function ( type, shoulder, humerus, radius, hand, claws, forceLink)
{
    forceLink = def( forceLink, false);
    type = def( type, DuAEF.Duik.Autorig.AnimalTypes.PLANTIGRADE);
    shoulder = def( shoulder, true);
    humerus = def( humerus, true);
    radius = def( radius, true);
    hand = def( hand, true);
    if (type == DuAEF.Duik.Autorig.AnimalTypes.PLANTIGRADE) claws = def( claws, false);
    else claws = def( claws, true);

    DuAEF.DuAE.App.beginUndoGroup("Create arm structure");

    DuAEF.DuAE.Project.setProgressMode(true);

    //if we have a shape layer selected and its path, and only a path, we're going to remove it after creation.
    var layers = DuAEF.DuAE.Comp.getSelectedLayers();
    var layerToRemove = null;
    var linkPath = false;
    if (typeof settings.data.structureLinkPaths !== 'undefined')
    {
        linkPath = settings.data.structureLinkPaths;
        if (forceLink) linkPath = !settings.data.structureLinkPaths;
    }
    
    if (layers.length == 1 && !linkPath)
    {
        var l = layers[0];
        if (DuAEF.DuAE.Shape.isSingleShape(l)) layerToRemove = l;
    }

    DuAEF.Duik.Structure.createArm(shoulder, humerus, radius, hand, claws,undefined,type,undefined, undefined, undefined, forceLink);

    if (layerToRemove != null) layerToRemove.remove();

    DuAEF.DuAE.Project.setProgressMode(false);

    DuAEF.DuAE.App.endUndoGroup();
}

Duik.structures.functions.push( { name:"Leg", fn:"Duik.structures.leg()" } );
Duik.structures.functions.push( { name:"Leg_Digitigrade", fn:"Duik.structures.leg(DuAEF.Duik.Autorig.AnimalTypes.DIGITIGRADE)" } );
Duik.structures.functions.push( { name:"Leg_Ungulate", fn:"Duik.structures.leg(DuAEF.Duik.Autorig.AnimalTypes.UNGULATE)" } );
Duik.structures.functions.push( { name:"Leg_Plantigrade", fn:"Duik.structures.leg(DuAEF.Duik.Autorig.AnimalTypes.PLANTIGRADE, true, true, true, true)" } );
/**
 * Creates a structure for an arm/back leg.
 * @param {DuAEF.Duik.Autorig.AnimalTypes} [type=DuAEF.Duik.Autorig.AnimalTypes.PLANTIGRADE] - One of DuAEF.Duik.Autorig.AnimalTypes.PLANTIGRADE, DuAEF.Duik.Autorig.AnimalTypes.DIGITIGRADE, DuAEF.Duik.Autorig.AnimalTypes.UNGULATE. See the {@link http://duaef-reference.rainboxlab.org/ | DuAEF Reference}
 * @param {boolean} [femur=true] - Wether to add a structure element for the femur
 * @param {boolean} [tibia=true] - Wether to add a structure element for the tibia
 * @param {boolean} [foot=true] - Wether to add a structure element for the foot
 * @param {boolean} [frontClaws=false] - Wether to add a structure element for the back claws. True by default if the structure is not for a Plantigrade.
 * @param {boolean} [forceLink=false] - Wether link the selected layers/properties to the new structures
 */
Duik.structures.leg = function ( type, femur, tibia, foot, claws, forceLink)
{
    forceLink = def( forceLink, false);
    type = def( type, DuAEF.Duik.Autorig.AnimalTypes.PLANTIGRADE);
    femur = def( femur, true);
    tibia = def( tibia, true);
    foot = def( foot, true);
    if (type == DuAEF.Duik.Autorig.AnimalTypes.PLANTIGRADE) claws = def( claws, false);
    else claws = def( claws, true);
    
    DuAEF.DuAE.App.beginUndoGroup("Create leg structure");

    DuAEF.DuAE.Project.setProgressMode(true);

    //if we have a shape layer selected and its path, and only a path, we're going to remove it after creation.
    var layers = DuAEF.DuAE.Comp.getSelectedLayers();
    var layerToRemove = null;
    var linkPath = false;
    if (typeof settings.data.structureLinkPaths !== 'undefined')
    {
        linkPath = settings.data.structureLinkPaths;
        if (forceLink) linkPath = !settings.data.structureLinkPaths;
    }
    if (layers.length == 1 && !linkPath)
    {
        var l = layers[0];
        if (DuAEF.DuAE.Shape.isSingleShape(l)) layerToRemove = l;
    }

    DuAEF.Duik.Structure.createLeg( femur, tibia, foot, claws,undefined,type, undefined, undefined, forceLink);

    if (layerToRemove != null) layerToRemove.remove();

    DuAEF.DuAE.Project.setProgressMode(false);

    DuAEF.DuAE.App.endUndoGroup();
}

Duik.structures.functions.push( { name:"Spine", fn:"Duik.structures.spine()" } );
/**
 * Creates a structure for a spine, neck and head.
 * @param {int} [numSpine=2] - The number of structure elements for the spine
 * @param {int} [numNeck=1] - The number of structure elements for the neck
 * @param {boolean} [head=true] - Wether to add a structure element for a head
 * @param {boolean} [forceLink=false] - Wether link the selected layers/properties to the new structures
 */
Duik.structures.spine = function ( numSpine, numNeck, hips, head, forceLink )
{
    forceLink = def( forceLink, false);
    numSpine = def( numSpine, 2);
    numNeck = def( numNeck, 1);
    hips = def( hips, true);
    head = def( head, true);

    var comp = DuAEF.DuAE.Project.getActiveComp();
    if (!comp) return;
    
    DuAEF.DuAE.App.beginUndoGroup("Create spine structure");

    DuAEF.DuAE.Project.setProgressMode(true);

    //if we have a shape layer selected and its path, and only a path, we're going to remove it after creation.
    var layers = DuAEF.DuAE.Comp.getSelectedLayers();
    var layerToRemove = null;
    var linkPath = false;
    if (typeof settings.data.structureLinkPaths !== 'undefined')
    {
        linkPath = settings.data.structureLinkPaths;
        if (forceLink) linkPath = !settings.data.structureLinkPaths;
    }
    if (layers.length == 1 && !linkPath)
    {
        var l = layers[0];
        if (DuAEF.DuAE.Shape.isSingleShape(l)) layerToRemove = l;
    }

    DuAEF.Duik.Structure.createSpine(hips ,numSpine,numNeck, head, undefined, undefined, forceLink);

    if (layerToRemove != null) layerToRemove.remove();

    DuAEF.DuAE.Project.setProgressMode(false);

    DuAEF.DuAE.App.endUndoGroup();
}

Duik.structures.functions.push( { name:"Tail", fn:"Duik.structures.tail()" } );
/**
 * Creates a structure for a tail.
 * @param {int} [numTail=3] - The number of structure elements for the tail
 * @param {boolean} [forceLink=false] - Wether link the selected layers/properties to the new structures
 */
Duik.structures.tail = function ( numTail, forceLink )
{
    forceLink = def( forceLink, false);
    numTail = def( numTail, 3);

    var comp = DuAEF.DuAE.Project.getActiveComp();
    if (!comp) return;

    DuAEF.DuAE.App.beginUndoGroup("Create tail structure");

    DuAEF.DuAE.Project.setProgressMode(true);

    //if we have a shape layer selected and its path, and only a path, we're going to remove it after creation.
    var layers = DuAEF.DuAE.Comp.getSelectedLayers();
    var layerToRemove = null;
    var linkPath = false;
    if (typeof settings.data.structureLinkPaths !== 'undefined')
    {
        linkPath = settings.data.structureLinkPaths;
        if (forceLink) linkPath = !settings.data.structureLinkPaths;
    }
    if (layers.length == 1 && !linkPath)
    {
        var l = layers[0];
        if (DuAEF.DuAE.Shape.isSingleShape(l)) layerToRemove = l;
    }

    DuAEF.Duik.Structure.createTail(numTail, undefined, forceLink);

    if (layerToRemove != null) layerToRemove.remove();

    DuAEF.DuAE.Project.setProgressMode(false);

    DuAEF.DuAE.App.endUndoGroup();
}

Duik.structures.functions.push( { name:"Custom Structures", fn:"Duik.structures.custom()" } );
/**
 * Creates custom structures.
 * @param {int} [num=3] - The number of structure elements
 * @param {string} [name='Structure'] - The name of the Structure
 * @param {boolean} [forceLink=false] - Wether link the selected layers/properties to the new structures
 * @param {boolean} [randomColor=false] - Wether pick a random color for the new Structure
 */
Duik.structures.custom = function ( num, name, forceLink, randomColor )
{
    randomColor = def( randomColor, false);
    num = def( num, 1);
    forceLink = def( forceLink, false);
    name = def( name, 'Structure');

    //get current comp
    var comp = DuAEF.DuAE.Project.getActiveComp();
    if (!comp) return;
    
    var pColor = DuAEF.Duik.Structure.color;
    if (randomColor) DuAEF.Duik.Structure.color = DuAEF.DuJS.Color.Colors.RANDOM;
    DuAEF.DuAE.App.beginUndoGroup("Create structure");

    DuAEF.DuAE.Project.setProgressMode(true);

    //if we have a shape layer selected and its path, and only a path, we're going to remove it after creation.
    var layers = DuAEF.DuAE.Comp.getSelectedLayers();
    var layerToRemove = null;
    var linkPath = settings.data.structureLinkPaths;
    if (forceLink) linkPath = !settings.data.structureLinkPaths;
    if (layers.length == 1 && !linkPath)
    {
        var l = layers[0];
        if (DuAEF.DuAE.Shape.isSingleShape(l)) layerToRemove = l;
    }

    DuAEF.Duik.Structure.addStructures(num, comp, name, false, forceLink);

    if (layerToRemove != null) layerToRemove.remove();

    DuAEF.DuAE.Project.setProgressMode(false);

    DuAEF.DuAE.App.endUndoGroup();
    DuAEF.Duik.Structure.color = pColor;
}

Duik.structures.functions.push( { name:"Show / Hide all structures", fn:"Duik.structures.show()" } );
/**
 * Shows/Hides all structures.
 * @param {boolean} [invert=false] - Wether invert the structure visibility instead of showing/hiding all
 */
Duik.structures.show = function ( invert )
{
    invert = def( invert, false);

    var structures = DuAEF.Duik.Structure.getStructureLayers();

    if (structures.length == 0) return;

    DuAEF.DuAE.App.beginUndoGroup("Show/hide structures");
    var visible = !structures[0].enabled;
    for (var i = 0 ; i < structures.length ; i++)
    {
        if (invert) structures[i].enabled = !structures[i].enabled;
        else structures[i].enabled = visible;
    }
    DuAEF.DuAE.App.endUndoGroup();
}

Duik.structures.functions.push( { name:"Edit Mode", fn:"Duik.structures.edit()" } );
/**
 * Toggles edit mode.
 */
Duik.structures.edit = function (  )
{
    //get from first element
    var structures = DuAEF.Duik.Structure.getStructures(undefined,DuAEF.Duik.Structure.SelectionModes.ELEMENT);

    DuAEF.DuAE.App.beginUndoGroup("Edit structures");
    for (var i = 0 ; i < structures.length ; i++)
    {
        structures[i].toggleEditMode();
    }
    DuAEF.DuAE.App.endUndoGroup();
}

Duik.structures.functions.push( { name:"Select all structures", fn:"Duik.structures.select()" } );
/**
 * Selects all structures.
 */
Duik.structures.select = function (  )
{
    DuAEF.DuAE.App.beginUndoGroup("Select structures");
    DuAEF.Duik.Structure.selectStructures(undefined, DuAEF.Duik.Structure.SelectionModes.ALL);
    DuAEF.DuAE.App.endUndoGroup();
}

Duik.structures.functions.push( { name:"Duplicate structures", fn:"Duik.structures.duplicate()" } );
/**
 * Duplicates selected structures.
 */
Duik.structures.duplicate = function (  )
{
    var comp = DuAEF.DuAE.Project.getActiveComp();
    if (!comp) return;

    var structures;
    if (comp.selectedLayers.length == 0) structures = DuAEF.Duik.Structure.getStructures(comp, DuAEF.Duik.Structure.SelectionModes.ALL);
    else structures = DuAEF.Duik.Structure.getStructures(comp, DuAEF.Duik.Structure.SelectionModes.ELEMENT);

    if (structures.length == 0) return;

    DuAEF.DuAE.App.beginUndoGroup("Duplicate structures");
    var autorigIds = [];
    var newStructures = [];

    var it = new Iterator(structures);
    it.do(function(structure)
    {
        var newStructure  = structure.duplicate();
        newStructures.push(newStructure);

        //adjust autorig id
        if (newStructure.elements.length > 0)
        {
            var element = newStructure.elements[0];
            var params = DuAEF.Duik.getDuikMarkerParameters(element);
            var newAutorigId = -1;
            var autorigId = -1;
            if (params[DuAEF.Duik.MarkerParameters.AUTORIG_ID]) autorigId = params[DuAEF.Duik.MarkerParameters.AUTORIG_ID];
            else return;

            for (var i = 0, num = autorigIds.length; i < num; i++)
            {
                if (autorigIds[i][0] == autorigId) newAutorigId = autorigIds[i][1];
            }

            if (newAutorigId == -1)
            {
                newAutorigId = new Date().getTime();
                autorigIds.push([autorigId,newAutorigId]);
            }

            var itElements = new Iterator(structure.elements);
            itElements.do(function(elmt)
            {
                DuAEF.Duik.setDuikMarkerParameter(elmt,DuAEF.Duik.MarkerParameters.AUTORIG_ID,newAutorigId);
            });
        }

    });

    //select all structures
    var itNew = new Iterator(newStructures);
    itNew.do(function(structure)
    {
        structure.select();
    });

    DuAEF.DuAE.App.endUndoGroup();
}// ==================== |------------------------------| ====================
// ==================== | Duik16_controllers_functions | ====================
// ==================== |------------------------------| ====================

/**
 * Duik {@link http://duaef-docs.rainboxlab.org/Guides/Duik/automations.html Controllers}<br />
 * Read the {@link http://duik-docs.rainboxlab.org | Duik User Guide} > {@link http://duaef-docs.rainboxlab.org/Guides/Duik/automations.html Controllers} for more information about each method.<br />
 * <code>#include 'Duik16_controllers_functions.jsxinc'</code>
 * @namespace
 */
Duik.controllers = {}

/**
 * All the controller methods stored as objects which can be parsed easily, for example to automatically build a ui with a button for each method.
 * @property {string} name - A display name for the method
 * @property {string} fn - The source script to eval
 */
Duik.controllers.functions = []

//The functions

Duik.controllers.functions.push( { name:"Rotation", fn:"Duik.controllers.create(DuAEF.Duik.Controller.Types.ROTATION)" } );
Duik.controllers.functions.push( { name:"X_Position", fn:"Duik.controllers.create(DuAEF.Duik.Controller.Types.X_POSITION)" } );
Duik.controllers.functions.push( { name:"Y_Position", fn:"Duik.controllers.create(DuAEF.Duik.Controller.Types.Y_POSITION)" } );
Duik.controllers.functions.push( { name:"Position", fn:"Duik.controllers.create(DuAEF.Duik.Controller.Types.POSITION)" } );
Duik.controllers.functions.push( { name:"Transform", fn:"Duik.controllers.create(DuAEF.Duik.Controller.Types.TRANSFORM)" } );
Duik.controllers.functions.push( { name:"Eye", fn:"Duik.controllers.create(DuAEF.Duik.Controller.Types.EYE)" } );
Duik.controllers.functions.push( { name:"Camera", fn:"Duik.controllers.create(DuAEF.Duik.Controller.Types.CAMERA)" } );
Duik.controllers.functions.push( { name:"Slider", fn:"Duik.controllers.create(DuAEF.Duik.Controller.Types.SLIDER)" } );
Duik.controllers.functions.push( { name:"2D_Slider", fn:"Duik.controllers.create(DuAEF.Duik.Controller.Types.DOUBLE_SLIDER)" } );
Duik.controllers.functions.push( { name:"Angle", fn:"Duik.controllers.create(DuAEF.Duik.Controller.Types.ANGLE)" } );
Duik.controllers.functions.push( { name:"Head", fn:"Duik.controllers.create(DuAEF.Duik.Controller.Types.HEAD)" } );
Duik.controllers.functions.push( { name:"Foot", fn:"Duik.controllers.create(DuAEF.Duik.Controller.Types.FOOT)" } );
Duik.controllers.functions.push( { name:"Claws", fn:"Duik.controllers.create(DuAEF.Duik.Controller.Types.CLAWS)" } );
Duik.controllers.functions.push( { name:"Hoof", fn:"Duik.controllers.create(DuAEF.Duik.Controller.Types.HOOF)" } );
Duik.controllers.functions.push( { name:"Hand", fn:"Duik.controllers.create(DuAEF.Duik.Controller.Types.HAND)" } );
Duik.controllers.functions.push( { name:"Hips", fn:"Duik.controllers.create(DuAEF.Duik.Controller.Types.HIPS)" } );
Duik.controllers.functions.push( { name:"Spine", fn:"Duik.controllers.create(DuAEF.Duik.Controller.Types.BODY)" } );
Duik.controllers.functions.push( { name:"Shoulders", fn:"Duik.controllers.create(DuAEF.Duik.Controller.Types.SHOULDERS)" } );
Duik.controllers.functions.push( { name:"Tail", fn:"Duik.controllers.create(DuAEF.Duik.Controller.Types.TAIL)" } );
Duik.controllers.functions.push( { name:"Null", fn:"Duik.controllers.create(DuAEF.Duik.Controller.Types.NULL)" } );
/**
 * Creates an controller
 * @param {DuAEF.Duik.Controller.Types} [type = DuAEF.Duik.Controller.Types.TRANSFORM] - The type of the controller. See the {@link http://duaef-reference.rainboxlab.org DuAEF} reference for more information.
 * @param {boolean} [parent = false] - Wether to parent the selected layers to the controllers
 * @param {boolean} [single = false] - Wether to create a single controller for all the layers
 * @return {Controller[]} the controllers created. See the {@link http://duaef-reference.rainboxlab.org DuAEF} reference for more information about the <code>Controller</code> object.
 */
Duik.controllers.create = function ( type, parent, single )
{
    type = def( type, DuAEF.Duik.Controller.Types.TRANSFORM);
    parent = def (parent, false);
    single = def (single, false);

    var comp = DuAEF.DuAE.Project.getActiveComp();
	if (!comp) return null;

	DuAEF.DuAE.App.beginUndoGroup( "Create controller");

	var layers = DuAEF.DuAE.Comp.unselectLayers();
	var ctrls = [];
	if (layers.length == 0) ctrls.push(DuAEF.Duik.Controller.create(comp,type));
	else if (single)
	{
		var ctrl = DuAEF.Duik.Controller.create(comp,type,layers, undefined, undefined, parent);
		ctrls.push(ctrl.layer);
	}
    else
	{
		for (var  i = 0 ; i < layers.length ; i++)
		{
			var ctrl = DuAEF.Duik.Controller.create(comp,type,layers[i], undefined, undefined, parent);
			ctrls.push(ctrl.layer);
		}
	}

	DuAEF.DuAE.Comp.selectLayers(ctrls);

	DuAEF.DuAE.App.endUndoGroup();

	return ctrls;
}

Duik.controllers.functions.push( { name:"PE_Eye", fn:"Duik.controllers.pseudoEffect(DuAEF.Duik.PseudoEffects.EYES)" } );
Duik.controllers.functions.push( { name:"PE_Fingers", fn:"Duik.controllers.pseudoEffect(DuAEF.Duik.PseudoEffects.FINGERS)" } );
Duik.controllers.functions.push( { name:"PE_Hand", fn:"Duik.controllers.pseudoEffect(DuAEF.Duik.PseudoEffects.HAND)" } );
Duik.controllers.functions.push( { name:"PE_Head", fn:"Duik.controllers.pseudoEffect(DuAEF.Duik.PseudoEffects.HEAD)" } );
/**
 * Adds a controller pseudo effect on the selected layers
 * @param {DuAEF.Duik.Controller.Types} type - The type of pseudo effect, one of: EYES, FINGERS, HAND, HEAD. See the {@link http://duaef-reference.rainboxlab.org DuAEF} reference for more information.
 */
Duik.controllers.pseudoEffect = function ( type )
{
    var layers = DuAEF.DuAE.Comp.getSelectedLayers();

    DuAEF.DuAE.App.beginUndoGroup("Add Pseudo-Effect");

    for (var i = 0, num = layers.length; i < num; i++)
    {
        //add effect
        DuAEF.DuAE.Layer.applyPreset(layers[i],type);
    }
    DuAEF.DuAE.App.endUndoGroup();
}

Duik.controllers.functions.push( { name:"Select all", fn:"Duik.controllers.select()" } );
/**
 * Selects all controllers in the composition
 */
Duik.controllers.select = function (  )
{
    var comp = DuAEF.DuAE.Project.getActiveComp();
    if (!comp) return;

    var ctrls = DuAEF.Duik.Controller.getControllers(comp,false);
    if (ctrls.length == 0) return;

    DuAEF.DuAE.App.beginUndoGroup("Select controllers");
    DuAEF.DuAE.Comp.unselectLayers(comp);
    for (var i = 0 ; i < ctrls.length ; i++)
    {
        ctrls[i].layer.selected = true;
    }
    DuAEF.DuAE.App.endUndoGroup();
}

Duik.controllers.functions.push( { name:"Show / Hide", fn:"Duik.controllers.show()" } );
/**
 * Shows or hides all controllers in the composition
 * @param {boolean} [invert=false] - If true, inverts the controller visibilities
 */
Duik.controllers.show = function ( invert )
{
    invert = def (invert, false);

    var ctrls = DuAEF.Duik.Controller.getControllers();

    if (ctrls.length == 0) return;

    DuAEF.DuAE.App.beginUndoGroup("Show/hide controllers");
    var visible = !ctrls[0].layer.enabled;
    for (var i = 0 ; i < ctrls.length ; i++)
    {
        if (invert) ctrls[i].layer.enabled = !ctrls[i].layer.enabled;
        else ctrls[i].layer.enabled = visible;
    }
    DuAEF.DuAE.App.endUndoGroup();
}

Duik.controllers.functions.push( { name:"Extract", fn:"Duik.controllers.extract()" } );
/**
 * Extracts the controllers from the selected precomposition
 * @param {boolean} [useMasterProperties=false] - Wether to use master properties instead of expressions to extract the controllers.
 */
Duik.controllers.extract = function ( useMasterProperties )
{
    var comp = DuAEF.DuAE.Project.getActiveComp();
	if (!comp) return;
	var layers = comp.selectedLayers;
	if (layers.length == 0) return;
	var precomp = layers[0];

	DuAEF.DuAE.App.beginUndoGroup("Extract Controllers");

	var result = DuAEF.Duik.Animation.extractControllersFromComp(precomp,useMasterProperties);

	DuAEF.DuAE.App.endUndoGroup();
}

Duik.controllers.functions.push( { name:"Tag", fn:"Duik.controllers.tag()" } );
/**
 * Tags the layers as controllers
 */
Duik.controllers.tag = function ( )
{
    var layers = DuAEF.DuAE.Comp.getSelectedLayers();
    DuAEF.DuAE.App.beginUndoGroup("Tag controllers");
    for (var i = 0, num = layers.length; i < num; i++)
    {
        DuAEF.Duik.setDuikMarker(layers[i], "Controller", DuAEF.Duik.LayerTypes.CONTROLLER);
    }
    DuAEF.DuAE.App.endUndoGroup();
}// ==================== |------------------------| ====================
// ==================== | Duik16_tools_functions | ====================
// ==================== |------------------------| ====================

/**
 * Duik {@link http://duaef-docs.rainboxlab.org/Guides/Duik/constraints.html Tools}<br />
 * Read the {@link http://duik-docs.rainboxlab.org Duik User Guide} > {@link http://duaef-docs.rainboxlab.org/Guides/Duik/constraints.html Tools} for more information about each method.<br />
 * <code>#include 'Duik16_tools_functions.jsxinc'</code>
 * @namespace
 */
Duik.tools = {}

/**
 * All the tools methods stored as objects which can be parsed easily, for example to automatically build a ui with a button for each method.
 * @property {string} name - A display name for the method
 * @property {string} fn - The source script to eval
 */
Duik.tools.functions = []

//The functions

Duik.tools.functions.push( { name:"Align layers", fn:"Duik.tools.align()" } );
/**
 * Align selected Layers to the last selected one
 * @param {boolean} [position=true] - Wether to align the position.
 * @param {boolean} [rotation=true] - Wether to align the rotation.
 * @param {boolean} [scale=true] - Wether to align the scale.
 * @param {boolean} [opacity=true] - Wether to align the opacity.
 */
Duik.tools.align = function ( position, rotation, scale, opacity )
{
    position = def (position, true);
    rotation = def (rotation, true);
    scale = def (scale, true);
    opacity = def (opacity, false);


    var layers = DuAEF.DuAE.Comp.getSelectedLayers();
    if (layers.length == 0) return;

    var target = layers.pop();

    DuAEF.DuAE.App.beginUndoGroup("Align layers");
    DuAEF.DuAE.Layer.align(
        layers,
        target,
        position,
        rotation,
        scale,
        opacity
    );
    DuAEF.DuAE.App.endUndoGroup();
}

Duik.tools.functions.push( { name:"Edit Mode", fn:"Duik.tools.editMode()" } );
/**
 * Toggle Edit Mode on selected layers.
 */
Duik.tools.editMode = function ( )
{
    var layers = DuAEF.DuAE.Comp.getSelectedLayers();
    DuAEF.DuAE.App.beginUndoGroup("Edit mode");
    for (var i = 0, num = layers.length ; i < num ; i++)
    {
        DuAEF.DuAE.Layer.toggleEditMode(layers[i]);
    }
    DuAEF.DuAE.App.endUndoGroup();
}

Duik.tools.functions.push( { name:"Remove Expressions", fn:"Duik.tools.removeExpressions()" } );
/**
 * Remove expressions from selected properties.
 */
Duik.tools.removeExpressions = function ( )
{
    var props = DuAEF.DuAE.Comp.getSelectedProps();

    DuAEF.DuAE.App.beginUndoGroup("Remove expressions");
    if (props.length > 0)
    {
        for (var i = 0, num = props.length; i < num; i++)
        {
            DuAEF.DuAE.Property.removeExpression(props[i]);
        }
    }
    else
    {
        var layers = DuAEF.DuAE.Comp.getSelectedLayers();
        for (var i = 0, num = layers.length; i < num; i++)
        {
            DuAEF.DuAE.Property.removeExpressions(layers[i]);
        }
    }
    DuAEF.DuAE.App.endUndoGroup();
}

/**
 * The expression which has been copied by {@link Duik.tools.copyExpression} and which can be pasted by {@link Duik.tools.pasteExpression}.
 */
Duik.tools.copiedExpression = '';

Duik.tools.functions.push( { name:"Copy Expression", fn:"Duik.tools.copyExpression()" } );
/**
 * Copies the expression from the selected property. You can paste it with {@link Duik.tools.pasteExpression}.
 * @return {string} The expression
 */
Duik.tools.copyExpression = function ( )
{
    var props = DuAEF.DuAE.Comp.getSelectedProps();
    if (props.length == 0) return;
    prop = props.pop();

    if (prop.riggable)
    {
        prop = prop.getProperty();
        Duik.tools.copiedExpression = prop.expression;
    }
    return Duik.tools.copiedExpression;
}

Duik.tools.functions.push( { name:"Paste Expression", fn:"Duik.tools.pasteExpression()" } );
/**
 * Pastes the expression previously copied with {@link Duik.tools.copyExpression} to the selected properties
 * @param {string} [expression] - The expression to set. If not provided, will automatically use the expression copied by {@link Duik.tools.copyExpression}.
 */
Duik.tools.pasteExpression = function ( expression )
{
    expression = def (expression , Duik.tools.copiedExpression);

    var props = DuAEF.DuAE.Comp.getSelectedProps();
    if (props.length == 0) return;

    DuAEF.DuAE.App.beginUndoGroup("Paste expression");
    
    new Iterator(props).do(function(prop)
    {
        if (prop.riggable)
        {
            var p = prop.getProperty();
            p.expression = expression;
        }
    });

    DuAEF.DuAE.App.endUndoGroup();
}// ==================== |----------------------------| ====================
// ==================== | Duik16_animation_functions | ====================
// ==================== |----------------------------| ====================

/**
 * Duik {@link http://duaef-docs.rainboxlab.org/Guides/Duik/constraints.html Animation}<br />
 * Read the {@link http://duik-docs.rainboxlab.org Duik User Guide} > {@link http://duaef-docs.rainboxlab.org/Guides/Duik/constraints.html Animation} for more information about each method.<br />
 * @namespace
 */
Duik.animation = {}

/**
 * All the animation methods stored as objects which can be parsed easily, for example to automatically build a ui with a button for each method.
 * @property {string} name - A display name for the method
 * @property {string} fn - The source script to eval
 */
Duik.animation.functions = []

//The functions

Duik.animation.functions.push( { name:"Klean", fn:"Duik.animation.klean()" } );
/**
 * Automatically clean the animation of the selected properties.
 * @param {boolean} [spatialInterpolation=true] - Wether to fix spatial interpolation.
 * @param {boolean} [smoothCurves=true] - Wether to apply a smart algorithm to smooth the curves.
 * @param {boolean} [removeUnnecessaryKeys=true] - Wether to remove all redundants keyframes.
 * @param {boolean} [smoothIn=true] - Wether to smooth the incoming curve if smoothCurves is set to true
 * @param {boolean} [smoothOut=true] - Wether to smooth the outgoing curve if smoothCurves is set to true
 */
Duik.animation.klean = function ( spatialInterpolation, smoothCurves, removeUnnecessaryKeys, smoothIn, smoothOut )
{
    spatialInterpolation = def (spatialInterpolation, true);
    smoothCurves = def (smoothCurves, true);
    removeUnnecessaryKeys = def (removeUnnecessaryKeys, true);
    smoothIn = def (smoothIn, true);
    smoothOut = def (smoothOut, true);

    var props = DuAEF.DuAE.Comp.getSelectedProps();
    if (props.length == 0) return;

    DuAEF.DuAE.App.beginUndoGroup("Kleaner");

    for (var i = 0 ; i < props.length ; i++)
    {
        //SPATIAL AUTO
        if ( spatialInterpolation ) DuAEF.DuAE.Property.fixSpatialInterpolation(props[i]);
        //SMART SMOOTH
        if ( smoothCurves ) DuAEF.Duik.Animation.smartInterpolation(props[i], smoothIn , smoothOut);
        //CLEAN
        if ( removeUnnecessaryKeys ) DuAEF.DuAE.Property.cleanKeyframes(props[i]);
    }

    DuAEF.DuAE.App.endUndoGroup();
}

/**
 * The animation copied by {@link Duik.animation.copy} which can be pasted with {@link Duik.animation.paste}. 
 */
Duik.animation.copied = {}

Duik.animation.functions.push( { name:"Copy Animation", fn:"Duik.animation.copy()" } );
/**
 * Copies the animation from the selected properties. Use {@link Duik.animation.paste} to paste it.
 */
Duik.animation.copy = function ( )
{
    var comp = DuAEF.DuAE.Project.getActiveComp();
    if (!comp) return;

    var layers = comp.selectedLayers;
    if (layers.length == 0) return;

    copiedAnim = [];

    for (var i = 0 ; i < layers.length ; i++)
    {
        copiedAnim.push(DuAEF.DuAE.Layer.getAnim(layers[i],true));
    }
    //get the first keyframe time to offset when pasting
    copiedAnim.firstKeyFrameTime = DuAEF.DuAE.Layer.firstKeyFrameTime(layers,true);

    Duik.animation.copied = copiedAnim;
}

Duik.animation.functions.push( { name:"Paste", fn:"Duik.animation.paste()" } );
Duik.animation.functions.push( { name:"Paste_Reverse", fn:"Duik.animation.paste( false, false, true )" } );
Duik.animation.functions.push( { name:"Paste_Offset", fn:"Duik.animation.paste( false, true )" } );
Duik.animation.functions.push( { name:"Paste_Replace", fn:"Duik.animation.paste( true )" } );
/**
 * Pastes the animation previously copied by {@link Duik.animation.copy} to the selected properties.
 * @param {boolean} replace - Wether to completely erase and replace the current animation
 * @param {boolean} offset - Wether to offset the animation from the current value
 * @param {boolean} reverse - Wether to reverse the animation
 */
Duik.animation.paste = function ( replace, offset, reverse )
{
    var comp = DuAEF.DuAE.Project.getActiveComp();
    if (!comp) return;

    var layers = DuAEF.DuAE.Comp.getSelectedLayers();
    if (layers.length == 0) layers = comp.layers;
    if (layers.length == 0) return;

    //options
    var time = comp.time-copiedAnim.firstKeyFrameTime;
    replace = def( replace, false );
    offset = def( offset, false );
    reverse = def( reverse, false );

    DuAEF.DuAE.App.beginUndoGroup("Paste animation");

    var remaining = DuAEF.DuAE.Layer.setAnims(layers, Duik.animation.copied, time, undefined, undefined, undefined, replace, undefined, offset, reverse);

    if (remaining.length > 0)
    {
        var ui_pasteLayerPicker = DuAEF.DuScriptUI.createLayerPickerDialog("Missing layers");

        for (var i = 0, num = remaining.length; i < num; i++)
        {
            ui_pasteLayerPicker.addSelector(remaining[i]._index + ' | ' + remaining[i]._name);
            //try to preselect by name
            var ok = false;
            for (var j = 1, numLayers = comp.numLayers; j <= numLayers; j++)
            {
                var l = comp.layer(j);
                if (l.name == remaining[i]._name)
                {
                    ui_pasteLayerPicker.layerPicker.selectors[i].setCurrentIndex(j);
                    ok = true;
                    break;
                }
            }
            if (!ok && remaining[i]._index > 0 && remaining[i]._index <= comp.numLayers) ui_pasteLayerPicker.layerPicker.selectors[i].setCurrentIndex(remaining[i]._index);
        }

        ui_pasteLayerPicker.onAccept = function () {DuAEF.DuAE.App.beginUndoGroup("Paste animation"); DuAEF.DuAE.Layer.setAllAnims(ui_pasteLayerPicker.getLayers(), Duik.animation.copied, time, undefined, undefined, undefined, replace, undefined, offset, false); DuAEF.DuAE.App.endUndoGroup();};

        DuAEF.DuScriptUI.showUI(ui_pasteLayerPicker);
    }

    DuAEF.DuAE.App.endUndoGroup();

}

Duik.animation.functions.push( { name:"IK/FK Switch", fn:"Duik.animation.switchIkFk( )" } );
/**
 * Switches the selected controller between IK and FK
 */
Duik.animation.switchIkFk = function ( )
{
    var comp = DuAEF.DuAE.Project.getActiveComp();
    if (!comp) return;

    DuAEF.DuAE.App.beginUndoGroup("FK/IK Switch");

    var it = new Iterator(comp.selectedLayers);
    it.do(function (layer) {
        DuAEF.Duik.Animation.switchIkFk(layer);
    });

    DuAEF.DuAE.App.endUndoGroup();
}

Duik.animation.functions.push( { name:"Motion Trail", fn:"Duik.animation.motionTrail( )" } );
/**
 * Draws the trajectory of the selected layers
 * @param {float[]|null} [color=null] - The [R,G,B,A] color of the trails. Random color if set to null.
 * @param {boolean} [useExisting=true] - Wether to use the existing motion trail layer, if any
 */
Duik.animation.motionTrail = function ( color, useExisting )
{
    var comp = DuAEF.DuAE.Project.getActiveComp();
    if (!comp) return;

    DuAEF.DuAE.App.beginUndoGroup("Motion trail");

    color = def(color, null);
    useExisting = def(useExisting, true);

    //trail layer
    var trailLayer = null;
    if ( useExisting )
    {
        for (var i = 1 ; i <= comp.numLayers ; i++)
        {
            var layer = comp.layer(i);
            if (layer instanceof ShapeLayer && layer.effect(DuAEF.Duik.PseudoEffectsMatchNames.MOTION_TRAIL))
            {
                trailLayer = layer;
                break;
            }
        }
    }

    var layers = DuAEF.DuAE.Comp.unselectLayers();

    if (layers.length > 0)
    {
        for (var i = 0 ; i < layers.length ; i++)
        {
            trailLayer = DuAEF.Duik.Animation.motionTrail(comp,layers[i],trailLayer,color);
        }
    }
    else
    {
        DuAEF.Duik.Animation.motionTrail(comp,undefined,trailLayer);
    }

    DuAEF.DuAE.App.endUndoGroup();
}

Duik.animation.functions.push( { name:"X-Sheet", fn:"Duik.animation.xSheet( )" } );
/**
 * Adds an Exposure Sheet (X-Sheet) effect on the selected layers or composition
 * @param {boolean} [autoDetect=false] - If true, will try to detect and animate the best exposure values for a nice traditionnal look.
 */
Duik.animation.xSheet = function ( autoDetect )
{
    var comp = DuAEF.DuAE.Project.getActiveComp();
    if (!comp) return;

    autoDetect = def (autoDetect, false);

    var props = DuAEF.DuAE.Comp.getSelectedProps();
    DuAEF.DuAE.App.beginUndoGroup("X-Sheet");

    var ok = false;
    if (props.length > 0)
    {
        var effect = null;
        for (var i = 0 ; i < props.length ; i++)
        {
            effect = DuAEF.Duik.Animation.xSheet(comp,props[i],effect);
            if (effect != null) ok = true;
        }
    }
    if (!ok)
    {
        effect = DuAEF.Duik.Animation.xSheet(comp);
    }

    if ( autoDetect && props.length > 0)
    {
        //detect limit
        var averageSpeed = DuAEF.DuAE.Property.getAverageSpeed(props);
        if (averageSpeed > 0)
        {
            var precision = averageSpeed*2.5;
            var frames = comp.duration / comp.frameDuration;
            //set Keyframes
            var step = 0;
            effect(19).addKey(0);
            for (var frame = 0 ; frame < frames ; frame++)
            {
                var time = frame*comp.frameDuration;

                var maxSpeed = 0;
                for (var j = 0 ; j < props.length ; j++)
                {
                    var prop = props[j].getProperty();
                    var speedTest = DuAEF.DuAE.Property.getSpeed(prop,time);
                    if (speedTest > maxSpeed) maxSpeed = speedTest;
                }

                step += maxSpeed;

                if (step >= precision && averageSpeed > 0)
                {
                    step = 0;
                    effect(19).addKey(time);
                }
            }
            effect(7).setValue(2);
        }

    }

    DuAEF.DuAE.App.endUndoGroup();

}

Duik.animation.functions.push( { name:"Time Remapping", fn:"Duik.animation.timeRemap( )" } );
/**
 * Activates time remapping on the selected layers, and add the looper {@link Duik.constraints.loop} to it.
 */
Duik.animation.timeRemap = function ( )
{
    var layers = DuAEF.DuAE.Comp.getSelectedLayers();
    DuAEF.DuAE.App.beginUndoGroup("Time Remap");
    DuAEF.Duik.Animation.timeRemap(layers);
    DuAEF.DuAE.App.endUndoGroup();
}// ==================== |-------------------------| ====================
// ==================== | Duik16_camera_functions | ====================
// ==================== |-------------------------| ====================

/**
 * Duik {@link http://duaef-docs.rainboxlab.org/Guides/Duik/constraints.html Camera}<br />
 * Read the {@link http://duik-docs.rainboxlab.org Duik User Guide} > {@link http://duaef-docs.rainboxlab.org/Guides/Duik/constraints.html Camera} for more information about each method.<br />
 * @namespace
 */
Duik.camera = {}

/**
 * All the camera methods stored as objects which can be parsed easily, for example to automatically build a ui with a button for each method.
 * @property {string} name - A display name for the method
 * @property {string} fn - The source script to eval
 */
Duik.camera.functions = []

//The functions

Duik.camera.functions.push( { name:"Rig", fn:"Duik.camera.rig()" } );
/**
 * Rigs the selected 3D Camera
 */
Duik.camera.rig = function (  )
{
    var layers = DuAEF.DuAE.Comp.unselectLayers();
    var numLayers = layers.length;
    if (numLayers == 0) return;

    DuAEF.DuAE.App.beginUndoGroup("Camera rig");

    var it = new Iterator(layers);
    it.do(function (layer)
    {
        if (layer instanceof CameraLayer)
        {
            DuAEF.Duik.Camera.rigCamera(layer);
        }
    });

    DuAEF.DuAE.App.endUndoGroup();
}

Duik.camera.functions.push( { name:"Scale Z-Link", fn:"Duik.camera.zLink()" } );
/**
 * Toggles the scale Z-link on the selected 3D Layers
 */
Duik.camera.zLink = function (  )
{
    var layers = DuAEF.DuAE.Comp.getSelectedLayers();
    if (layers.length  == 0) return;

    DuAEF.DuAE.App.beginUndoGroup("Toggle Scale Z-Link");

    DuAEF.Duik.Camera.toggleScaleZLink(layers);

    DuAEF.DuAE.App.endUndoGroup();

}

Duik.camera.functions.push( { name:"2D Camera", fn:"Duik.camera.create2DCam()" } );
/**
 * Creates a 2D multi-plane camera
 */
Duik.camera.create2DCam = function (  )
{
    DuAEF.DuAE.App.beginUndoGroup("2D Camera");

    DuAEF.Duik.Camera.create2DCam();

    DuAEF.DuAE.App.endUndoGroup();
}

Duik.camera.functions.push( { name:"Framing guides", fn:"Duik.camera.frame()" } );
/**
 * Adds framing guides to the composition
 */
Duik.camera.frame = function (  )
{
    DuAEF.DuAE.App.beginUndoGroup("Framing Guides");
    DuAEF.Duik.Camera.addFrame();
    DuAEF.DuAE.App.endUndoGroup();
}