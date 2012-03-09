/* g_data */
g_data = {
	imageW: {
		bg: {
			data: [
				[0, 0, 359, 639, 0, 0, 359, 639]
			],
			filename: 'images/backdrop.png'
		},
		grid: {
			data: [
				[0, 0, 371, 61, 0, 0, 371, 61]
			],
			filename: 'images/grid_w.png'
		},
		ship: {
			data: [
				[0, 0, 23, 23, 0, 0, 23, 23],
				[24, 0, 47, 23, 24, 0, 47, 23],
				[48, 0, 71, 23, 48, 0, 71, 23],
				[72, 0, 95, 23, 72, 0, 95, 23],
				[96, 0, 119, 23, 96, 0, 119, 23],
				[120, 0, 143, 23, 120, 0, 143, 23],
				[144, 0, 167, 23, 144, 0, 167, 23]
			],
			filename: 'images/ship.png'
		},
		enemy: {
			data: [
				[8, 8, 23, 23, 8, 8, 23, 23]
			],
			filename: 'images/mine.png'
		},
		explosion: {
			data: [
				[0, 0, 31, 31, 0, 0, 31, 31],
				[32, 0, 63, 31, 32, 0, 63, 31],
				[64, 0, 95, 31, 64, 0, 95, 31]
			],
			filename: 'images/explosion.png'
		},
		plasma: {
			data: [
				[42, 42, 49, 95, 42, 42, 49, 95]
			],
			filename: 'images/plasma.png'
		}
	},
	
	font: {
		enemy: {
				"outline_b": 0,
				"font": "Allan",
				"outline": 2.0,
				"base_b": 255,
				"base_g": 255,
				"outline_r": 0,
				"base_r": 255,
				"size": 16,
				"id": "enemy",
				"outline_g": 0
		},
		enemy_red: {
			"outline_b": 0,
				"font": "Allan",
				"outline": 2.0,
				"base_b": 40,
				"base_g": 115,
				"outline_r": 0,
				"base_r": 245,
				"size": 16,
				"id": "enemy_red",
				"outline_g": 0
		},
		bigFont: {
				"outline_b": 0,
				"font": "Allan",
				"outline": 1.0,
				"base_b": 255,
				"base_g": 255,
				"outline_r": 0,
				"base_r": 255,
				"size": 26,
				"id": "bigFont",
				"outline_g": 0
				
			},
		scoreFont: {
			"outline_b": 0,
				"font": "Allan",
				"outline": 1.0,
				"base_b": 255,
				"base_g": 255,
				"outline_r": 0,
				"base_r": 255,
				"size": 12,
				"id": "scoreFont",
				"outline_g": 0
		}
	}
}