namespace :custom do
  desc 'Yarn Build Server App'
  task :yarn_build do
    on roles(:app) do
      within "#{release_path}/client" do
        execute :yarn, 'install --production'
        execute :yarn, 'build'
        execute :ln, "-sfn #{shared_path}/public/images #{release_path}/client/build/images"
        execute :mv, "public public_old"
        execute :ln, "-sfn #{shared_path}/public #{release_path}/client/public"
      end

      within "#{release_path}" do
        execute :yarn, "install --production"
        execute :yarn, "tsc"
      end
    end
  end
end