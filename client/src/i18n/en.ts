const en = {
  Home: "Home",
  Email: "Email",
  Password: "Password",
  Verify_password: "Verify Password",
  Display_name: "Display Name",
  Create_account: "Create Account",
  Create_new_account: "Create New Account",
  Create_the_account: "Create Account",
  Log_in: "Log in",
  Log_out: "Log out",
  Invalid_login: "Invalid Login",
  Account_not_verified:
    "This account needs to be verified. Check your email for the confirmation email from Alphachart and follow the confirmation link in the email.",
  Invalid_email: "Email is invalid.",
  Password_too_short: "Please choose a password with at least 10 characters.",
  Passwords_do_not_match: "Passwords do not match.",
  User_exists: "A user already exists for that email address.",
  Alphabet_charts: "Alphabet Charts",
  Save: "Save",
  Saving: "Saving...",
  Save_and_quit: "Save and Quit",
  Cancel: "Cancel",
  Close: "Close",
  Done: "Done",
  Unknown_error: "Unknown error",
  Edit_chart: "Edit Chart",
  Copy_to: "Copy to",
  Image_options: "Image Options",
  Width: "Width",
  Height: "Height",
  Background_color: "Background Color",
  Trouble_loading_user_info: "Trouble loading user info...",
  Loading: "Loading...",
  Error_creating_chart_image: "There was a problem creating that chart.",
  New_alphabet_chart: "New Alphabet Chart",
  My_alphabets: "My Alphabets",
  Other_alphabets: "Other Alphabets",
  Add_letters: "Add Letters",
  Columns: "Columns",
  Chart_settings: "Chart Settings",
  Add_form: "Add form",
  Position: "Position",
  New_letter_before: "New letter before ",
  New_letter_after: "New letter after ",
  Delete_letter: "Delete ",
  Font: "Font",
  Title_font_size: "Title Font Size",
  Subtitle_font_size: "Subtitle Font Size",
  Top_alphabet_font_size: "Top Alphabet Font Size",
  Top_alphabet_spacing: "Top Alphabet Spacing",
  Letter_font_size: "Letter Font Size",
  Reverse_letters: "Reverse Letters",
  Letter_position: "Letter Position",
  Example_word_font_size: "Example Word Font Size",
  Last_row_filler_font_size: "Last Row Filler Font Size",
  Footer_font_size: "Footer Font Size",
  Title_position: "Title Position",
  center: "Center",
  left: "Left",
  right: "Right",
  split: "Split",
  Show_top_alphabet: "Show Top Alphabet?",
  Top_alphabet_style: "Top Alphabet Style",
  Bold_key_letter: "Bold Key Letter?",
  Border_thickness: "Border Thickness",
  Border_color: "Border Color",
  Old_api_error: "The Alphachart app needs to update.",
  Reload: "Reload",
  Size: "Size",
  Image_position: "Image Position",
  Right_to_left: "Right to Left",
  Account_confirmation: "Account Confirmation",
  Confirmation_link_email:
    "A confirmation email was sent to %{email}. Click the confirmation link in the email to finish setting up your account.",
  Account_verified: "Account Verified!",
  Verifying: "Verifying",
  Invalid_code:
    "The verification code is invalid. Did you already verify your account?",
  Confirm_your_Alphachart_account: "Confirm your Alphachart account",
  Welcome_to_Alphachart: "Welcome to Alphachart",
  Hi: "Hi %{name}",
  Welcome_email_confirm_text:
    "To get started making alphabet charts, please %{startLink}confirm your account%{endLink}.",
  Welcome_email_ignore:
    "(If you did not request an Alphachart account, just ignore this email.)",
  No_connection: "No Connection",
  Connection_restored: "Connection restored",
  Server_error: "Server Error: %{status}",
  Image_too_big: "That image is too big.",
  App_error: "App Error (Code %{status})",
  Groups: "Groups",
  My_groups: "My Groups",
  Users: "Users",
  Add: "Add",
  Remove: "Remove",
  Create: "Create",
  Add_user: "Add User",
  Remove_user: "Remove User",
  Name_or_email: "Name or email",
  New_alphabet: "New Alphabet",
  Language: "Language",
  For_account: "For account",
  By_name: "By %{name}",
  New_group: "New Group",
  Create_group: "Create Group",
  Name: "Name",
  Manage_users: "Manage Users",
  Confirm_remove_user_from_group: "Remove %{userName} from %{groupName}?",
  Confirm_archive_chart: "Archive the alphabet chart for %{name}?",
  Guest_users: "Guest Users",
  Share_explanation: "These users can edit this alphabet chart.",
  User_added: "Added %{name}.",
  Ok: "OK",
  Browser_not_supported:
    "This browser is not supported. Use Chrome, Edge or Firefox to export chart images.",
  Export_chart: "Export Chart",
  Text_size: "Text Size",
  Extra_vertical_space: "Extra Vertical Space",
  Extra_horizontal_space: "Extra Horizontal Space",
  Transparent: "Transparent",
  Save_image: "Save Image",
  Paper_options: "Paper Options",
  Dimensions: "Dimensions",
  Target: "Target",
  Actual: "Actual",
  Paper_size: "Paper Size",
  Landscape: "Landscape",
  Custom_size: "Custom Size",
  Units: "Units",
  DPI: "DPI",
  Custom: "Custom",
  Save_pdf: "Save PDF",
  Changes_saved: "Changes saved.",
  Change_name: "Change Name",
  Change_email: "Change Email",
  New_name: "New Name",
  New_email: "New Email",
  Add_alphabet: "Add Alphabet",
  Archive: "Archive"
};

export type Strings = typeof en;
export type TKey = keyof Strings | "";
export default en;

export function isTKey(str: any): str is TKey {
  return str in en;
}
