// Copyright 2013-2017, University of Colorado Boulder

/**
 * Primary model for the Ohm's Law simulation, see doc/model.md for more information.
 * @author Vasily Shakhov (Mlearner)
 * @author Anton Ulyanov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var OhmsLawConstants = require( 'OHMS_LAW/ohms-law/OhmsLawConstants' );
  var ohmsLaw = require( 'OHMS_LAW/ohmsLaw' );

  /**
   * @constructor
   */
  function OhmsLawModel() {

    // @public {Property.<number>} in volts
    this.voltageProperty = new NumberProperty( OhmsLawConstants.VOLTAGE_RANGE.getDefaultValue() );

    // @public {Property.<number>} in Ohms
    this.resistanceProperty = new NumberProperty( OhmsLawConstants.RESISTANCE_RANGE.getDefaultValue() );

    // @public {Property.<number>} create a derived property that tracks the current in milli amps
    this.currentProperty = new DerivedProperty( [ this.voltageProperty, this.resistanceProperty ],
      function( voltage, resistance ) {
        return 1000 * voltage / resistance;
      } );
  }

  ohmsLaw.register( 'OhmsLawModel', OhmsLawModel );

  return inherit( Object, OhmsLawModel, {

    /**
     * resets the properties of the model
     * @public
     */
    reset: function() {
      this.voltageProperty.reset();
      this.resistanceProperty.reset();
      this.soundActiveProperty.reset();
    }
  } );
} );
