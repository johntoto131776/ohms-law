// Copyright 2016, University of Colorado Boulder

/**
 * View of Single Battery
 * The battery is laid out on its side, with the positive pole pointing to the right
 * @author Vasily Shakhov (Mlearner)
 * @author Anton Ulyanov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ohmsLaw = require( 'OHMS_LAW/ohmsLaw' );
  var OhmsLawConstants = require( 'OHMS_LAW/ohms-law/OhmsLawConstants' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  // strings
  var voltageUnitsString = require( 'string!OHMS_LAW/voltageUnits' );

  // constants
  var FONT = new PhetFont( { size: 20, weight: 'bold' } );
  var NUB_WIDTH = OhmsLawConstants.BATTERY_WIDTH * 0.05;
  var MAIN_BODY_WIDTH = OhmsLawConstants.BATTERY_WIDTH * 0.87;
  var COPPER_PORTION_WIDTH = OhmsLawConstants.BATTERY_WIDTH - MAIN_BODY_WIDTH - NUB_WIDTH;
  var BATTERY_HEIGHT = OhmsLawConstants.BATTERY_HEIGHT;
  var NUB_HEIGHT = OhmsLawConstants.BATTERY_HEIGHT * 0.30;

  /**
   * @param {Object} [options]
   * @constructor
   */
  function BatteryView( options ) {

    Node.call( this );

    // convert voltage to percentage (0 to 1)
    var voltageToScale = new LinearFunction( 0.1, OhmsLawConstants.AA_VOLTAGE, 0.0001, 1, true );

    // fill for the battery
    var mainBodyFill = new LinearGradient( 0, 0, 0, BATTERY_HEIGHT )
      .addColorStop( 0, '#777777' )
      .addColorStop( 0.3, '#bdbdbd' )
      .addColorStop( 1, '#2b2b2b' );
    var copperPortionFill = new LinearGradient( 0, 0, 0, BATTERY_HEIGHT )
      .addColorStop( 0, '#cc4e00' )
      .addColorStop( 0.3, '#dddad6' )
      .addColorStop( 1, '#cc4e00' );
    var nubFill = '#dddddd';

    // the origin (0,0) is defined as the leftmost and vertically centered position of the battery
    var batteryNode = new Node();
    var mainBody = new Rectangle( 0, 0, MAIN_BODY_WIDTH, BATTERY_HEIGHT, {
      stroke: '#000',
      lineWidth: 1,
      fill: mainBodyFill,
      y: -BATTERY_HEIGHT / 2
    } );
    var copperPortion = new Rectangle( 0, 0, COPPER_PORTION_WIDTH, BATTERY_HEIGHT, {
      stroke: '#000',
      lineWidth: 1,
      fill: copperPortionFill,
      y: -BATTERY_HEIGHT / 2,
      x: MAIN_BODY_WIDTH
    } );
    var nub = new Rectangle( COPPER_PORTION_WIDTH, 0, NUB_WIDTH, NUB_HEIGHT, {
      stroke: '#000',
      lineWidth: 1,
      fill: nubFill,
      y: -NUB_HEIGHT / 2,
      x: MAIN_BODY_WIDTH
    } );
    // add battery to the scene graph
    batteryNode.addChild( mainBody );
    batteryNode.addChild( copperPortion );
    batteryNode.addChild( nub );
    this.addChild( batteryNode );

    // voltage label associated with the battery
    var batteryText = new Node( { x: 3 } );
    var voltageStringMaxWidth = new Text( '9.9', { font: FONT } ).width;
    var voltageValueText = new Text( OhmsLawConstants.AA_VOLTAGE, { font: FONT } );
    var voltageUnitsText = new Text( voltageUnitsString, {
      font: FONT,
      fill: 'blue',
      x: voltageStringMaxWidth * 1.1,
      maxWidth: ( MAIN_BODY_WIDTH - voltageStringMaxWidth ) * 0.9 // limit to 90% of remaining space
    } );
    this.addChild( batteryText );
    batteryText.addChild( voltageValueText );
    batteryText.addChild( voltageUnitsText );

    this.mutate( options );

    /**
     * set the length of the battery as well as voltage text and position of the text associated with the battery
     * @param {number} voltage
     */
    this.setVoltage = function( voltage ) {
      // update the text of the
      voltageValueText.text = Util.toFixed( voltage, 1 );

      // adjust length of the battery
      mainBody.setRect( 0, 0, MAIN_BODY_WIDTH * voltageToScale( voltage ), BATTERY_HEIGHT );
      copperPortion.x = mainBody.right;
      nub.x = mainBody.right;

      // set vertical position of the voltage label
      if ( voltage >= OhmsLawConstants.AA_VOLTAGE ) {
        batteryText.centerY = -7; // move slightly up from centered position
      }
      // move up if the voltage is greater than 0.1 but less than OhmsLawConstants.AA_VOLTAGE
      else if ( voltage >= 0.1 ) {
        batteryText.centerY = -BATTERY_HEIGHT / 2 - 12; // place it above the battery
      }

    };
  }

  ohmsLaw.register( 'BatteryView', BatteryView );

  return inherit( Node, BatteryView );
} );
