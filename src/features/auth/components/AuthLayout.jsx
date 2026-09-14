import logo from "../../../assets/logo.jpg";

function AuthLayout({ children, title, description }) {
  return (
    <div className="min-h-screen bg-paper text-ink lg:grid lg:grid-cols-2">

      {/* Left — Brand panel */}
      <section className="relative hidden overflow-hidden bg-ink p-12 text-paper lg:flex lg:flex-col lg:justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Acuity logo"
            className="h-10 w-10 rounded-full object-contain"
          />

          <span className="text-xl font-semibold tracking-tight">
            Acuity
          </span>
        </div>


        {/* Snellen-inspired typography */}
        <div className="mb-12">

          <p className="text-6xl font-semibold leading-[0.95]">
            See clearly.
          </p>

          <p className="mt-4 pl-6 text-4xl font-medium leading-none text-paper/70">
            Answer better.
          </p>

          <p className="mt-4 pl-14 text-2xl font-medium leading-none text-paper/50">
            Improve precisely.
          </p>

        </div>


        {/* Bottom description */}
        <div className="border-t border-white/15 pt-6">

          <p className="max-w-sm text-sm leading-relaxed text-paper/60">
            Practice interviews, understand your performance,
            and identify what needs improvement.
          </p>

        </div>

      </section>


      {/* Right — Form panel */}
      <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10">

        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="mb-16 flex items-center gap-3 lg:hidden">

            <img
              src={logo}
              alt="Acuity logo"
              className="h-9 w-9 rounded-full object-contain"
            />

            <span className="text-xl font-semibold tracking-tight">
              Acuity
            </span>

          </div>


          {/* Heading */}
          <div className="mb-10">

            <h1 className="text-3xl font-semibold tracking-tight">
              {title}
            </h1>

            {description && (
              <p className="mt-3 text-base leading-relaxed text-slate">
                {description}
              </p>
            )}

          </div>


          {/* Form */}
          {children}

        </div>

      </section>

    </div>
  );
}

export default AuthLayout;