namespace :custom do
  desc 'Yarn Build Server App'
  task :yarn_build do
    on roles(:app) do
      within "#{release_path}" do
        execute :yarn, "install --immutable"
        execute :yarn, "tsc"
      end

      within "#{release_path}/client" do
        execute :yarn, 'build'
        execute :ln, "-sfn #{shared_path}/public/images #{release_path}/client/build/images"
        execute :mv, "public public_old"
        execute :ln, "-sfn #{shared_path}/public #{release_path}/client/public"
      end
    end
  end
end
