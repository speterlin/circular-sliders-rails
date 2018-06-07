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

    <canvas id="sliders" width="1200" height="300" style="border:1px solid;"></canvas>

Use jQuery to add circular sliders to the canvas area. Pass slider settings as objects in an array. Create multiple sliders or just a single slider.

    <script>
      $('#sliders').sliders([
        {
          name: "Age",
          centerX: 175,
          minValue: 18,
          maxValue: 66,
          step: 1,
          units: "years",
          color: "#FF7F50",
          textColor: "#FF7F50"
        },
        {
          name: "Daily activity",
          units: "miles",
          minValue: 0,
          maxValue: 25,
          step: 1,
          color: "#FF7F50",
          textColor: "#FF7F50"
        },
        {
          name: "Height",
          color: "#FFDEAD",
          type: "Height",
          centerX: 375,
          minValue: 0,
          maxValue: 250,
          step: 2,
          units: "cm",
          radius: 100
        },
        {
          name: "Weight",
          color: "#A52A2A",
          type: "Weight",
          minValue: 0,
          maxValue: 150,
          radius: 100,
          centerX: 600,
          step: 5,
          units: "kg",
          lineWidth: 10
        },
        {
          name: "Waist size",
          color: "#A0522D",
          type: "Waist",
          centerX: 825,
          radius: 100,
          minValue: 0,
          maxValue: 50,
          lineWidth: 10,
          step: 2,
          units: "cm",
          ballColor: "#A0522D"
        },
        {
          name: "Shoe size",
          type: "Shoe",
          centerX: 1050,
          radius: 100,
          lineWidth: 10,
          minValue: 10,
          maxValue: 60,
          step: 1,
          textColor: "#0000FF"
        },
        {
          name: "Desired price",
          priceUnits: "£",
          textColor: "#0000FF",
          step: 5
        }
      ]);
    </script>

Slider settings:

| Name            | Type   | Default                             | Description                                            |
| --------------- | ------ | ----------------------------------- | ------------------------------------------------------ |
| name            | String | Slider n                            | Name your slider                                       |
| type            | String | Plain                               | Pick between various types for interesting graphics at the center of the slider: 'Height', 'Weight', 'Shoe', 'Waist', and more to come!                                       |
| centerX         | Float  | Center of canvas or previous slider | Specify the x value for the center of the slider       |
| centerY         | Float  | Center of canvas or previous slider | Specify the y value for the center of the slider       |
| color           | String | "#0000FF"                           | Specify the color of the arc fill                      |
| minValue        | Float  | 0                                   | The minimum value of your slider                       |
| maxValue        | Float  | 100                                 | The maximum value of your slider                       |
| step            | Float  | 10                                  | The amount the value is incremented                    |
| units           | String | ""                                  | The units your value is displayed in                   |
| priceUnits      | String | ""                                  | Adds price ('$', '€', '£' ...) before value            |
| radius          | Float  | 40 or (previous slider radius + previous slider lineWidth + 5)  | The radius of your slider                              |
| lineWidth       | Float  | 5                                   | The slider and arc width                               |
| strokeColor     | String | "#D3D3D3"                           | The color of the dashes on the slider                  |
| ballColor       | String | "#000000"                           | The color of the slider ball                           |
| textColor       | String | "#000000"                           | The color of the slider label (name, value and units)  |

Retrieve values of individual sliders by calling:

    $('#sliders').data('slider_name');

You should see something like this (with the above options):

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
