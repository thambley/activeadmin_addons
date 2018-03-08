module ActiveAdminAddons
  module Rails
    class Engine < ::Rails::Engine
      require "select2-rails"
      require "sass-rails"
      require "xdan-datetimepicker-rails"

      initializer "initialize addons" do |app|
        require_relative "support/input_helpers/input_methods"
        require_relative "support/input_helpers/filter_input_methods"
        require_relative "support/input_helpers/filter_input"
        require_relative "support/input_helpers/input_html_helpers"
        require_relative "support/input_helpers/input_options_handler"
        require_relative "support/input_helpers/select_helpers"
        require_relative "support/custom_builder"
        require_relative "support/enumerize_formtastic_support"
        require_relative "support/input_base"
        require_relative "support/set_datepicker"
        require_relative "addons/attachment_builder"
        require_relative "addons/bool_builder"
        require_relative "addons/image_builder"
        require_relative "addons/list_builder"
        require_relative "addons/number_builder"
        require_relative "addons/state_builder"
        require_relative "addons/tag_builder"
        require_relative "addons/toggle_bool_builder"
        require_relative "active_admin_config"
        app.config.assets.precompile += %w(select.scss fileicons/*.png switches/switch_*.png)
      end
    end
  end
end
