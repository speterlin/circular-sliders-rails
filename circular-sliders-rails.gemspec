# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'circular/sliders/rails/version'

Gem::Specification.new do |spec|
  spec.name          = "circular-sliders-rails"
  spec.version       = Circular::Sliders::Rails::VERSION
  spec.authors       = ["Sebastian Peterlin"]
  spec.email         = ["speterlin@gmail.com"]

  spec.summary       = %q{Draw concentric circles and responsively set each value.}
  spec.description   = %q{A Ruby on Rails gem which allows you to draw concentric responsive circular sliders with jQuery. Requires jQuery.}
  spec.homepage      = "https://github.com/speterlin/circular-sliders-rails"
  spec.license       = "MIT"

  # Prevent pushing this gem to RubyGems.org. To allow pushes either set the 'allowed_push_host'
  # to allow pushing to a single host or delete this section to allow pushing to any host.
  if spec.respond_to?(:metadata)
    spec.metadata['allowed_push_host'] = "https://rubygems.org"
  else
    raise "RubyGems 2.0 or newer is required to protect against public gem pushes."
  end

  spec.files         = `git ls-files -z`.split("\x0").reject { |f| f.match(%r{^(test|spec|features)/}) }
  spec.bindir        = "exe"
  spec.executables   = spec.files.grep(%r{^exe/}) { |f| File.basename(f) }
  spec.require_paths = ["lib"]

  spec.add_development_dependency "bundler", "~> 1.12"
  spec.add_development_dependency "rake", "~> 10.0"
  spec.add_development_dependency "rspec", "~> 3.0"

  spec.add_dependency "rails", "~> 5.0"
end
