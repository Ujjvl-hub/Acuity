import { useState } from "react";
import {
  User,
  SlidersHorizontal,
  Bell,
  Save,
  RotateCcw,
  Trash2,
  AlertTriangle,
  Loader2,
  CheckCircle2,
} from "lucide-react";

const defaultSettings = {
  name: "Ujjwal",
  email: "ujjwal@example.com",
  difficulty: "Intermediate",
  duration: "15",
  sessionReminder: true,
  performanceUpdates: true,
};

export default function Settings() {
  const [name, setName] = useState(defaultSettings.name);
  const [email, setEmail] = useState(defaultSettings.email);

  const [difficulty, setDifficulty] = useState(
    defaultSettings.difficulty
  );

  const [duration, setDuration] = useState(
    defaultSettings.duration
  );

  const [sessionReminder, setSessionReminder] = useState(
    defaultSettings.sessionReminder
  );

  const [performanceUpdates, setPerformanceUpdates] = useState(
    defaultSettings.performanceUpdates
  );

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const [lastSavedSettings, setLastSavedSettings] = useState({
    ...defaultSettings,
  });

  const currentSettings = {
    name,
    email,
    difficulty,
    duration,
    sessionReminder,
    performanceUpdates,
  };

  const hasChanges =
    JSON.stringify(currentSettings) !==
    JSON.stringify(lastSavedSettings);

  const handleChange = (setter, value) => {
    setter(value);
    setSaved(false);
  };

  const handleSave = async () => {
    if (saving || !hasChanges) return;

    setSaving(true);
    setSaved(false);

    try {
      // Backend integration later
      //
      // PUT /users/settings
      //
      // Example:
      // await settingsApi.update(currentSettings);

      await new Promise((resolve) => setTimeout(resolve, 800));

      console.log("Saved settings:", currentSettings);

      setLastSavedSettings({ ...currentSettings });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  const handleResetPreferences = () => {
    setDifficulty(defaultSettings.difficulty);
    setDuration(defaultSettings.duration);
    setSessionReminder(defaultSettings.sessionReminder);
    setPerformanceUpdates(defaultSettings.performanceUpdates);

    setSaved(false);
  };

  const handleDeleteAccount = () => {
    // Backend integration later
    //
    // DELETE /users/me

    console.log("Account deletion confirmed");

    setConfirmingDelete(false);
  };

  return (
    <div className="mx-auto max-w-5xl">

      {/* Header */}
      <section className="border-b border-hairline pb-8">
        <p className="text-sm text-slate">
          Account
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Settings.
        </h1>

        <p className="mt-3 max-w-2xl leading-relaxed text-slate">
          Manage your profile, interview preferences, and notifications.
        </p>
      </section>


      {/* Profile */}
      <section className="border-b border-hairline py-10">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-focus/10">
            <User
              size={18}
              className="text-focus"
            />
          </div>

          <div>
            <p className="text-sm text-slate">
              Account information
            </p>

            <h2 className="mt-1 text-xl font-semibold text-ink">
              Profile
            </h2>
          </div>

        </div>


        <div className="mt-8 grid gap-6 sm:grid-cols-2">

          {/* Name */}
          <div>

            <label
              htmlFor="name"
              className="text-sm font-medium text-ink"
            >
              Name
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) =>
                handleChange(setName, event.target.value)
              }
              className="mt-3 w-full rounded-[4px] border border-hairline bg-paper px-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-slate/50 focus:border-focus focus:ring-2 focus:ring-focus/10"
            />

          </div>


          {/* Email */}
          <div>

            <label
              htmlFor="email"
              className="text-sm font-medium text-ink"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                handleChange(setEmail, event.target.value)
              }
              className="mt-3 w-full rounded-[4px] border border-hairline bg-paper px-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-slate/50 focus:border-focus focus:ring-2 focus:ring-focus/10"
            />

          </div>

        </div>

      </section>


      {/* Interview Preferences */}
      <section className="border-b border-hairline py-10">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-focus/10">
            <SlidersHorizontal
              size={18}
              className="text-focus"
            />
          </div>

          <div>
            <p className="text-sm text-slate">
              Practice configuration
            </p>

            <h2 className="mt-1 text-xl font-semibold text-ink">
              Interview preferences
            </h2>
          </div>

        </div>


        <div className="mt-8 grid gap-8 sm:grid-cols-2">

          {/* Difficulty */}
          <div>

            <p className="text-sm font-medium text-ink">
              Default difficulty
            </p>

            <p className="mt-1 text-sm leading-relaxed text-slate">
              Used as the starting point for new interview sessions.
            </p>


            <div className="mt-4 flex flex-wrap gap-2">

              {[
                "Beginner",
                "Intermediate",
                "Advanced",
              ].map((item) => {

                const active =
                  difficulty === item;

                return (

                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      handleChange(
                        setDifficulty,
                        item
                      )
                    }
                    aria-pressed={active}
                    className={`rounded-[4px] px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "bg-ink text-paper"
                        : "border border-hairline text-slate hover:border-ink/30 hover:text-ink"
                    }`}
                  >
                    {item}
                  </button>

                );
              })}

            </div>

          </div>


          {/* Duration */}
          <div>

            <label
              htmlFor="duration"
              className="text-sm font-medium text-ink"
            >
              Default session duration
            </label>

            <p className="mt-1 text-sm leading-relaxed text-slate">
              Choose how long you want a typical practice session to last.
            </p>


            <select
              id="duration"
              value={duration}
              onChange={(event) =>
                handleChange(
                  setDuration,
                  event.target.value
                )
              }
              className="mt-4 w-full rounded-[4px] border border-hairline bg-paper px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-focus focus:ring-2 focus:ring-focus/10"
            >
              <option value="10">
                10 minutes
              </option>

              <option value="15">
                15 minutes
              </option>

              <option value="20">
                20 minutes
              </option>

              <option value="30">
                30 minutes
              </option>

            </select>

          </div>

        </div>

      </section>


      {/* Notifications */}
      <section className="border-b border-hairline py-10">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-focus/10">
            <Bell
              size={18}
              className="text-focus"
            />
          </div>

          <div>

            <p className="text-sm text-slate">
              Stay informed
            </p>

            <h2 className="mt-1 text-xl font-semibold text-ink">
              Notifications
            </h2>

          </div>

        </div>


        <div className="mt-8 border-t border-hairline">

          {/* Practice reminders */}
          <div className="flex items-center justify-between gap-6 border-b border-hairline py-6">

            <div>

              <p className="text-sm font-medium text-ink">
                Practice reminders
              </p>

              <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate">
                Receive reminders to maintain a consistent interview
                practice routine.
              </p>

            </div>


            <button
              type="button"
              onClick={() =>
                handleChange(
                  setSessionReminder,
                  !sessionReminder
                )
              }
              aria-pressed={sessionReminder}
              aria-label="Toggle practice reminders"
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                sessionReminder
                  ? "bg-focus"
                  : "bg-hairline"
              }`}
            >

              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-paper transition-transform ${
                  sessionReminder
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />

            </button>

          </div>


          {/* Performance updates */}
          <div className="flex items-center justify-between gap-6 py-6">

            <div>

              <p className="text-sm font-medium text-ink">
                Performance updates
              </p>

              <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate">
                Get updates when your interview performance and progress
                change.
              </p>

            </div>


            <button
              type="button"
              onClick={() =>
                handleChange(
                  setPerformanceUpdates,
                  !performanceUpdates
                )
              }
              aria-pressed={performanceUpdates}
              aria-label="Toggle performance updates"
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                performanceUpdates
                  ? "bg-focus"
                  : "bg-hairline"
              }`}
            >

              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-paper transition-transform ${
                  performanceUpdates
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />

            </button>

          </div>

        </div>

      </section>


      {/* Save */}
      <section className="flex flex-col gap-5 border-b border-hairline py-8 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <p className="text-sm font-medium text-ink">
            Save your changes
          </p>

          <p className="mt-1 text-sm text-slate">
            Your preferences will be applied to future sessions.
          </p>


          {saved && (

            <div className="mt-3 flex items-center gap-2 text-sm font-medium text-focus">

              <CheckCircle2 size={16} />

              Changes saved successfully.

            </div>

          )}

        </div>


        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-[4px] bg-focus px-5 py-2.5 text-sm font-semibold text-paper transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >

          {saving ? (

            <Loader2
              size={16}
              className="animate-spin"
            />

          ) : (

            <Save size={16} />

          )}

          {saving
            ? "Saving..."
            : "Save changes"}

        </button>

      </section>


      {/* Reset */}
      <section className="border-b border-hairline py-8">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <p className="text-sm font-medium text-ink">
              Reset preferences
            </p>

            <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate">
              Restore your interview preferences and notification settings
              to their default values.
            </p>

          </div>


          <button
            type="button"
            onClick={handleResetPreferences}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-[4px] border border-hairline px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-ink"
          >

            <RotateCcw size={16} />

            Reset preferences

          </button>

        </div>

      </section>


      {/* Danger Zone */}
      <section className="py-10">

        <div className="rounded-[4px] border border-red-100 p-6">

          <div className="flex items-start gap-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] bg-red-50">

              <Trash2
                size={18}
                className="text-red-500"
              />

            </div>


            <div className="flex-1">

              <p className="text-sm font-semibold text-ink">
                Delete account
              </p>

              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate">
                Permanently delete your account, interview history,
                resume data, and saved preferences.
              </p>


              {!confirmingDelete ? (

                <button
                  type="button"
                  onClick={() =>
                    setConfirmingDelete(true)
                  }
                  className="mt-5 text-sm font-semibold text-red-500 transition-opacity hover:opacity-80"
                >
                  Delete account
                </button>

              ) : (

                <div className="mt-5 flex flex-col gap-4 rounded-[4px] border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex items-center gap-2 text-sm text-red-600">

                    <AlertTriangle size={16} />

                    This action can't be undone.
                    Are you sure?

                  </div>


                  <div className="flex gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        setConfirmingDelete(false)
                      }
                      className="rounded-[4px] border border-hairline bg-paper px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:border-ink"
                    >
                      Cancel
                    </button>


                    <button
                      type="button"
                      onClick={handleDeleteAccount}
                      className="rounded-[4px] bg-red-500 px-3 py-1.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    >
                      Yes, delete
                    </button>

                  </div>

                </div>

              )}

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}