# keep-supabase-project-alive

A simple GitHub workflow to periodically ping your Supabase project. It prevents the platform from suspending your project due to inactivity.

If your project has low activity at the moment but you need to keep it alive, this is the simplest way.

## How it works

A GitHub Actions workflow runs on a cron schedule (every Monday and Thursday at 9:00 UTC by default). It sends a `POST` request to a Supabase Edge Function called `keep-alive`, which performs a lightweight read query against your database, enough to count as activity and keep the project awake.

## Setup

### 1. Create the Edge Function

In your Supabase project, create a new Edge Function named **`keep-alive`** and paste the contents of [`keep-alive.ts`](./keep-alive.ts) into it.

> The function queries 1 row from a table called `content`. Change the table name on line 30 to any table that exists in your project.

Deploy it via the Supabase dashboard or CLI.

### 2. Add the GitHub workflow

Copy [`workflow.yml`](./workflow.yml) into your repository at:

```
.github/workflows/keep-alive.yml
```

### 3. Fill in your credentials

Open the workflow file and replace the two placeholders:

| Placeholder | Where to find it |
|---|---|
| `[your project url]` | Supabase dashboard → Project Settings → API → Project URL |
| `[publishable anon key]` | Supabase dashboard → Project Settings → API → `anon` `public` key |

Both values are **public/anon** and are safe to commit. Do not use the `service_role` key here!

### 4. (Optional) Adjust the schedule

The default cron `0 9 * * 1,4` runs every **Monday and Thursday at 9:00 UTC**. Edit it to whatever frequency you need. Supabase suspends projects after **7 days** of inactivity, so pinging twice a week is more than enough.

You can also trigger it manually anytime via **Actions → Run workflow** in GitHub.
