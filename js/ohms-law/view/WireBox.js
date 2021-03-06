// Copyright 2013-2017, University of Colorado Boulder

/**
 * View circuit with a resistor, a battery pack, two current arrows and a current readout panel
 * @author Vasily Shakhov (Mlearner)
 * @author Anton Ulyanov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var BatteriesView = require( 'OHMS_LAW/ohms-law/view/BatteriesView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ohmsLaw = require( 'OHMS_LAW/ohmsLaw' );
  var OhmsLawA11yStrings = require( 'OHMS_LAW/ohms-law/OhmsLawA11yStrings' );
  var OhmsLawConstants = require( 'OHMS_LAW/ohms-law/OhmsLawConstants' );
  var ReadoutPanel = require( 'OHMS_LAW/ohms-law/view/ReadoutPanel' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ResistorNode = require( 'OHMS_LAW/ohms-law/view/ResistorNode' );
  var RightAngleArrow = require( 'OHMS_LAW/ohms-law/view/RightAngleArrow' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Util = require( 'DOT/Util' );

  // a11y strings
  var circuitLabelString = OhmsLawA11yStrings.circuitLabelString;
  var circuitDescriptionString = OhmsLawA11yStrings.circuitDescriptionString;
  var currentDescriptionPatternString = OhmsLawA11yStrings.currentDescriptionPatternString;

  // constants
  var WIDTH = OhmsLawConstants.WIRE_WIDTH;
  var HEIGHT = OhmsLawConstants.WIRE_HEIGHT;
  var WIRE_THICKNESS = 10;
  var OFFSET = 10;  // position offset for the RightAngleArrow

  /**
   * @param {OhmsLawModel} model
   * @param {Tandem} tandem
   * @param {Object} options
   * @constructor
   */
  function WireBox( model, tandem, options ) {

    Node.call( this, {

      tandem: tandem,

      // a11y
      tagName: 'ul',
      labelTagName: 'h3',
      accessibleLabel: circuitLabelString,
      accessibleDescriptionAsHTML: circuitDescriptionString,
      prependLabels: true
    } );
    var self = this;

    // For positioning, the top left corner of the wireFrame is defined as 0,0
    var wireFrame = new Rectangle( 0, 0, WIDTH, HEIGHT, 4, 4, {
      stroke: '#000',
      lineWidth: WIRE_THICKNESS,
      tandem: tandem.createTandem( 'wireFrame' )
    } );
    this.addChild( wireFrame );

    var batteriesView = new BatteriesView( model.voltageProperty, tandem.createTandem( 'batteriesView' ), {
      left: OhmsLawConstants.BATTERIES_OFFSET, // Slightly to the right of the wire
      centerY: 0
    } );
    this.addChild( batteriesView );

    var resistorNode = new ResistorNode( model.resistanceProperty, tandem.createTandem( 'resistorNode' ), {
      centerX: WIDTH / 2,
      centerY: HEIGHT,

      // a11y
      tagName: 'li'
    } );
    this.addChild( resistorNode );

    // @private
    this.bottomLeftArrow = new RightAngleArrow( model.currentProperty, tandem.createTandem( 'bottomLeftArrow' ), {
      x: -OFFSET,
      y: HEIGHT + OFFSET,
      rotation: Math.PI / 2
    } );
    this.addChild( this.bottomLeftArrow );

    var bottomRightArrow = new RightAngleArrow( model.currentProperty, tandem.createTandem( 'bottomRightArrow' ), {
      x: WIDTH + OFFSET,
      y: HEIGHT + OFFSET,
      rotation: 0
    } );
    this.addChild( bottomRightArrow );

    // a11y - accessible description for the current
    var accessibleCurrentNode = new Node( { tagName: 'li' } );
    this.addChild( accessibleCurrentNode );

    var currentReadoutPanel = new ReadoutPanel( model, tandem.createTandem( 'currentReadoutPanel' ), {
      centerY: HEIGHT / 2,
      centerX: WIDTH / 2
    } );
    this.addChild( currentReadoutPanel );

    model.voltageProperty.set( OhmsLawConstants.VOLTAGE_RANGE.min );
    model.resistanceProperty.set( OhmsLawConstants.RESISTANCE_RANGE.max );

    // @private - this is the min height of the arrows for this sim
    this.minArrowHeight = this.bottomLeftArrow.height;

    // reset the model after using to get height of arrows
    model.reset();

    // a11y - when the current changes, update the accessible description
    model.currentProperty.link( function( current ) {
      var formattedCurrent = Util.toFixed( current, OhmsLawConstants.CURRENT_SIG_FIGS );

      accessibleCurrentNode.accessibleLabelAsHTML = StringUtils.fillIn( currentDescriptionPatternString, {
        arrowSize: self.getArrowSizeDescription(),
        value: formattedCurrent
      } );
    } );

    // a11y - the order of descriptions should be batteries, resistance, then current
    this.accessibleOrder = [ batteriesView, resistorNode, accessibleCurrentNode ];

    this.mutate( options );
  }

  ohmsLaw.register( 'WireBox', WireBox );

  return inherit( Node, WireBox, {

    /**
     * Get a description of the arrow size.  Returns omething like "small" or "huge" or "medium size".
     * @public
     *
     * @return {string}
     */
    getArrowSizeDescription: function() {

      var height = this.bottomLeftArrow.height;

      // Empirically determined, the idea is for the largest relative size string to map to when the 'I' in the formula
      // goes off the screen (or at least close to that), see https://github.com/phetsims/ohms-law/issues/97.
      var maxArrowHeightThresholdCoefficient = 2;

      // The max in the linear function, instead of the max height of the arrow, everything bigger will just be the
      // largest relative size.
      var maxArrowHeightThreshold = HEIGHT * maxArrowHeightThresholdCoefficient;

      // map the normalized height to one of the size descriptions
      var index = Util.roundSymmetric( Util.linear(
        this.minArrowHeight, maxArrowHeightThreshold, // a1 b1
        0, OhmsLawConstants.RELATIVE_SIZE_STRINGS.length - 1, // a2 b2
        height ) ); // a3

      // if beyond the threshold, clamp it back to the highest index
      if ( height > maxArrowHeightThreshold ) {
        index = OhmsLawConstants.RELATIVE_SIZE_STRINGS.length - 1;
      }
      assert && assert( index >= 0 && index < OhmsLawConstants.RELATIVE_SIZE_STRINGS.length,
        'mapping to relative size string incorrect' );
      return OhmsLawConstants.RELATIVE_SIZE_STRINGS[ index ].toLowerCase();
    }
  } );
} );