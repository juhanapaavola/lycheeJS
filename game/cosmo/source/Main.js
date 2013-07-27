
lychee.define('game.Main').requires([
	'game.Jukebox',
	'game.entity.ui.Font',
	'game.logic.Game',
	'game.state.Game',
	'game.state.Menu',
	'game.DeviceSpecificHacks'
]).includes([
	'lychee.game.Main'
]).exports(function(lychee, game, global, attachments) {

	var Class = function(data) {

		var settings = lychee.extend({

			title: 'Cosmo',

			fullscreen: true,

			music: false,
			sound: true,

			input: {
				fireKey:      true,
				fireModifier: false,
				fireTouch:    true,
				fireSwipe:    false
			},

			renderer: {
				id:     'game',
				width:  800,
				height: 600
			}

		}, data);


		lychee.game.Main.call(this, settings);

		this.init();

	};


	Class.prototype = {

		reshape: function(orientation, rotation, width, height) {

			var resetstates = false;

			var renderer = this.renderer;
			if (
				   width !== undefined
				&& height !== undefined
				&& renderer !== null
			) {

				var env = renderer.getEnvironment();

				if (
					this.settings.fullscreen === true
					&& (
						   env.width !== width
						|| env.height !== height
					)
				) {

					resetstates = true;

				}

			}


			lychee.game.Main.prototype.reshape.call(this, orientation, rotation, width, height);


			if (resetstates === true) {
				this.resetStates();
			}

		},

		reset: function(state) {

			game.DeviceSpecificHacks.call(this);

			// This will initially reset the viewport
			// based on the DeviceSpecificHacks
			this.reshape();


			if (state === true) {

				// This will leave the current state and
				// pass in empty data (for level interaction)
				this.resetState(null, null);

			}

		},

		init: function() {

			// Remove Preloader Progress Bar
			lychee.Preloader.prototype._progress(null, null);


			lychee.game.Main.prototype.init.call(this);
			this.reset(false);


			this.fonts = {};
			this.fonts.hud    = new game.entity.ui.Font('hud');
			this.fonts.normal = new game.entity.ui.Font('normal');
			this.fonts.small  = new game.entity.ui.Font('hud');


			this.jukebox = new game.Jukebox(this);
			this.logic   = new game.logic.Game(this);

			this.setState('game', new game.state.Game(this));
			this.setState('menu', new game.state.Menu(this));
			this.changeState('menu');


			if (lychee.debug === true) {

				if (this.settings.stage !== undefined) {
					this.changeState('game', this.settings.stage);
				}


				if (this.settings.points !== undefined) {

					var data = this.logic.__level.getData();
					data.points = this.settings.points;
					this.logic.__level.trigger('update', [ data ]);

				}

			}


			this.start();

		},

		// TODO: hide/show integration
		start: function() {},
		stop:  function() {}

	};


	return Class;

});