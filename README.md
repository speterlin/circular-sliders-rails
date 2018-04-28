# Circular Sliders for Rails

A Ruby on Rails gem which allows you to draw concentric responsive circular sliders with jQuery. Requires jQuery.

## Installation

Add this line to your application's Gemfile:

```ruby
gem 'circular-sliders-rails'
```

And then execute:

    $ bundle

Or install it yourself as:

    $ gem install circular-sliders-rails

## Usage

Include in your application.js file:

    //= require circular-sliders

Create a canvas element in the view where you would like the sliders to go:

    <canvas id="sliders" width="600" height="300" style="border:1px solid;"></canvas>

Use jQuery to add circular sliders to the canvas area. Pass slider settings as objects in an array. Create multiple sliders or just a single slider.

    <script>
      $('#sliders').sliders([
        {
          name: "Height",
          color: "#FFDEAD",
          centerX: 200,
          centerY: 150,
          minValue: 0,
          maxValue: 250,
          step: 0.5,
          units: "cm",
          radius: 60,
          lineDashLength: 5,
          lineDashSpacing: 5,
          lineWidth: 5,
          strokeColor: "#D3D3D3",
        },
        {
          name: "Weight",
          color: "#A52A2A",
          minValue: 0,
          maxValue: 150,
          step: 5,
          units: "kg",
          lineDashLength: 5,
          lineDashSpacing: 10,
          lineWidth: 10,
          strokeColor: "#D3D3D3",
        },
        {
          name: "Waist size",
          centerX: 400,
          centerY: 150,
          color: "#A0522D",
          radius: 40,
          minValue: 0,
          maxValue: 50,
          lineWidth: 10,
          step: 2,
          units: "cm",
          ballColor: "#A0522D"
        },
        {
          name: "Shoe size",
          minValue: 10,
          maxValue: 60,
          step: 1
        }
      ]);
    </script>

Slider settings:

| Name            | Type   | Default                  | Description                                                            |
| --------------- | ------ | ------------------------ | ---------------------------------------------------------------------- |
| name            | String | Slider n                 | Name your slider                                                       |
| centerX         | Float  | Center of Canvas         | Specify the x value of where you'd like the center of the slider to be |
| centerY         | Float  | Center of Canvas         | Specify the y value of where you'd like the center of the slider to be |
| color           | String | "#0000FF"                | Specify the color of the arc fill                                      |
| minValue        | Float  | 0                        | The minimum value of your slider                                       |
| maxValue        | Float  | 0                        | The maximum value of your slider                                       |
| step            | Float  | 10                       | The amount the value is incremented                                    |
| units           | String | ""                       | The units your value is displayed in                                   |
| radius          | Float  | 40 or (prevRadius +≈ 15) | The radius of your slider                                              |
| lineDashLength  | Float  | 5                        | The arc length of each dash of your slider                             |
| lineDashSpacing | Float  | 5                        | The arc spacing length of each dash of your slider                     |
| lineWidth       | Float  | 5                        | The arc spacing length of each dash of your slider                     |
| strokeColor     | String | "#D3D3D3"                | The color of the dashes on the slider                                  |
| ballColor       | String | "#000000"                | The color of the slider ball                                           |
| textColor       | String | "#000000"                | The color of the slider label (name, value and units)                  |

Retrieve values of individual sliders by calling:

    $('#sliders').data('slider_name');

You should see something like this:

![Circular sliders](/vendor/assets/images/circular-sliders-rails.png)

<!-- ## Development -->

<!-- To install this gem onto your local machine, run `bundle exec rake install`. To release a new version, update the version number in `version.rb`, and then run `bundle exec rake release`, which will create a git tag for the version, push git commits and tags, and push the `.gem` file to [rubygems.org](https://rubygems.org). -->


## Contributing

  1. Fork it
  1. Create your feature branch (`git checkout -b my-new-feature`)
  1. Commit your changes (`git commit -am 'Add some feature'`)
  1. Push to the branch (`git push origin my-new-feature`)
  1. Create new Pull Request

Bug reports and pull requests are welcome on GitHub at https://github.com/speterlin/circular-sliders-rails. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.


## License

The gem is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).
