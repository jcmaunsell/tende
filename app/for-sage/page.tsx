import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How your website works — Tende",
  robots: { index: false, follow: false },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="font-display font-bold text-xl uppercase tracking-widest text-foreground mb-4 pb-2 border-b border-parchment">
        {title}
      </h2>
      <div className="space-y-3 text-sm font-light font-sans text-foreground/80 leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-petrol text-white text-xs flex items-center justify-center font-sans font-normal mt-0.5">
        {n}
      </span>
      <p>{children}</p>
    </div>
  );
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-parchment/60 border-l-2 border-teal px-4 py-3 text-sm font-sans text-foreground/70 leading-relaxed">
      {children}
    </div>
  );
}

function Link({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-teal underline underline-offset-2">
      {children}
    </a>
  );
}

export default function ForSagePage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="mb-12">
        <p className="text-xs uppercase tracking-widest text-muted font-sans mb-3">Just for you</p>
        <h1 className="font-display font-bold text-4xl uppercase text-foreground mb-4">
          How your website works
        </h1>
        <p className="text-sm font-light font-sans text-foreground/70 leading-relaxed">
          A plain-language guide to managing your website — adding products, updating prices,
          announcing events, and understanding what happens when a customer orders.
        </p>
        <div className="mt-4 bg-parchment/60 border-l-2 border-teal px-4 py-3 text-sm font-sans text-foreground/70 leading-relaxed">
          <strong>Right now</strong> the new site lives at{" "}
          <a href="https://tende-beta.vercel.app" target="_blank" rel="noopener noreferrer" className="text-teal underline underline-offset-2">tende-beta.vercel.app</a>.
          The old Squarespace site is still at tende.care until the DNS is switched over.
        </div>
      </div>

      <Section title="Your content lives in Sanity Studio">
        <p>
          Everything you see on the website — products, fragrances, events — is managed through
          Sanity Studio. You can access it at{" "}
          <Link href="https://tende-beta.vercel.app/studio">tende-beta.vercel.app/studio</Link> or directly at{" "}
          <Link href="https://sanity.io/manage">sanity.io/manage</Link>.
        </p>
        <p>
          When you publish a change in Studio, the website updates automatically. You don&apos;t
          need to touch the code or contact James.
        </p>
      </Section>

      <Section title="Adding a new product">
        <Step n={1}>In Studio, go to <strong>Products</strong> and click the compose icon (✏️) to create a new one.</Step>
        <Step n={2}>Fill in the title, slug (URL-friendly name — Studio can generate this for you), tagline, description, and price.</Step>
        <Step n={3}>Upload product images. The first image is what shows on the shop page.</Step>
        <Step n={4}>Set the category (<em>hair, body, skincare, scalp, accessories, merch</em>) so it appears in the right filter on the shop page.</Step>
        <Step n={5}>If the product comes in multiple fragrances, add variants — each one links to a Fragrance from your shared list and can have its own price.</Step>
        <Step n={6}>Mark it <strong>In Stock</strong> and hit <strong>Publish</strong>.</Step>
        <Tip>
          <strong>Stripe syncs automatically.</strong> When you publish a new product, a price is created in Stripe and saved back to the product within a few seconds. You don&apos;t need to do anything in Stripe.
        </Tip>
      </Section>

      <Section title="Managing fragrances">
        <p>
          Fragrances are a shared list — you create them once and reuse them across products.
          Go to <strong>Fragrances</strong> in Studio to add a new scent.
        </p>
        <p>
          Each fragrance has a <strong>name</strong> (e.g. Frosted Bloom) and optional{" "}
          <strong>scent notes</strong> (e.g. Jasmine &amp; Winter Citrus). The notes show as
          smaller text under the name in the product selector.
        </p>
        <Tip>
          If a fragrance is misspelled or needs renaming, change it in the Fragrances list and
          it will update everywhere automatically — you don&apos;t need to edit each product individually.
        </Tip>
      </Section>

      <Section title="Putting something on sale">
        <p>
          To mark a product or variant as on sale, fill in the <strong>Compare At Price</strong>{" "}
          field with the original (higher) price. Set the current <strong>Price</strong> to the
          sale price.
        </p>
        <p>
          You can set a sale at the product level (applies to the whole product) or on individual
          variants (e.g. only Frosted Bloom and Spiced Fig are on sale for the Shampoo Bar).
        </p>
        <p>
          A teal <strong>Sale</strong> chip will appear automatically on the product card and next
          to the fragrance name in the variant selector.
        </p>
        <Tip>
          To end a sale, just clear the Compare At Price field and republish.
        </Tip>
      </Section>

      <Section title="Marking something out of stock">
        <p>
          On the product, toggle <strong>In Stock</strong> to off and publish. The product will
          stay visible on the site but the add-to-cart button will show &ldquo;Out of Stock&rdquo;.
        </p>
        <p>
          For multi-fragrance products, you can mark individual variants out of stock without
          affecting the others — the out-of-stock variant will be greyed out and crossed through
          in the selector.
        </p>
      </Section>

      <Section title="Upcoming events">
        <p>
          Go to <strong>Events</strong> in Studio to add a market, pop-up, or workshop.
          Each event has a title, date, location, description, and an optional image.
        </p>
        <p>
          Past events disappear from the page automatically once their date has passed — you
          don&apos;t need to remove them manually.
        </p>
      </Section>

      <Section title="When a customer orders">
        <Step n={1}>The customer adds items to their cart and clicks Checkout.</Step>
        <Step n={2}>Stripe&apos;s secure checkout page collects their payment, shipping address, and phone number.</Step>
        <Step n={3}>Once payment is confirmed, the site automatically calculates the package dimensions based on what was ordered, purchases a USPS shipping label, and emails it directly to you.</Step>
        <Step n={4}>Your email will include: the order summary, the shipping address, a link to print the label, and the tracking number. The customer receives a separate email with their tracking number automatically.</Step>
        <Step n={5}>Print the label, pack the order, and drop it off at USPS.</Step>
        <Tip>
          <strong>No manual label creation needed.</strong> The label is purchased and emailed to you automatically the moment the order comes in.
        </Tip>
        <Tip>
          You&apos;re currently in <strong>test mode</strong> in Stripe, which means no real money moves and you
          can use card number <code className="bg-parchment px-1 py-0.5 rounded text-xs">4242 4242 4242 4242</code> to test checkout.
          When you&apos;re ready to go live, James will switch Stripe to live mode.
        </Tip>
        <p>You can see all orders in your <Link href="https://dashboard.stripe.com/payments">Stripe dashboard</Link> under Payments.</p>
      </Section>

      <Section title="Contact form">
        <p>
          When someone submits the contact form at{" "}
          <Link href="https://tende-beta.vercel.app/contact">tende-beta.vercel.app/contact</Link>, their message
          arrives in your inbox at <strong>hello@tende.care</strong>. The reply-to address is set
          to the sender, so you can reply directly from your email client.
        </p>
      </Section>

      <Section title="If something looks wrong">
        <p>
          <strong>A product I just published isn&apos;t showing up</strong> — wait 30 seconds and
          refresh. If it still doesn&apos;t appear, check that you clicked Publish (not just Save as
          draft) in Studio.
        </p>
        <p>
          <strong>A customer can&apos;t check out</strong> — the most likely cause is Stripe is
          still in test mode. Send James a message.
        </p>
        <p>
          <strong>Anything else</strong> — reach out to James. The site is on GitHub and Vercel,
          so most issues can be diagnosed and fixed quickly.
        </p>
      </Section>

      <Section title="How your products show up on Google">
        <p>
          Each product page is set up so Google can find it. When someone searches for something like
          &ldquo;plant-based shampoo bar bergamot&rdquo; or &ldquo;Atlas Rose body scrub,&rdquo; your product pages
          can show up in results with your product image, title, and description.
        </p>
        <p>
          The most important thing you can do for SEO is write good, specific product descriptions in Sanity Studio.
          Describe what the product <em>does</em>, what it <em>smells like</em>, who it&apos;s <em>for</em>, and what&apos;s
          <em> in it</em>. The more specific and genuine, the better.
        </p>
        <p>
          The <strong>Tagline</strong> field on each product is what shows as the short preview text in search results — keep it
          to one clear sentence.
        </p>
        <Tip>
          Google takes time — it can take a few weeks after launch for product pages to start appearing in search.
          You don&apos;t need to do anything technical; the site handles the rest automatically.
        </Tip>
      </Section>

      <Section title="Before the site goes live">
        <p className="text-foreground/60 text-xs uppercase tracking-widest font-sans mb-4">
          Launch checklist — James will handle most of these
        </p>

        <div className="space-y-3">
          {[
            {
              done: false,
              item: "Switch Stripe from test mode to live mode — James will replace the test API keys with live ones, and re-run the product sync script so all prices exist in the live account.",
            },
            {
              done: false,
              item: "Verify the Stripe webhook is pointing at the live site (tende.care) and re-register it for the live Stripe account.",
            },
            {
              done: false,
              item: "Confirm Resend is verified for hello@tende.care so contact form emails don't land in spam.",
            },
            {
              done: false,
              item: "Review all product prices, descriptions, and images one more time in Sanity Studio.",
            },
            {
              done: false,
              item: "Assign categories to any products that show up as uncategorized on the shop page.",
            },
            {
              done: false,
              item: "Re-upload all product images directly to Sanity. Currently some images are still hosted on Squarespace's servers — once the Squarespace subscription lapses, those images will break. Upload them in Sanity Studio by editing each product and replacing the images.",
            },
            {
              done: false,
              item: "Do a test order end-to-end in live mode: add to cart, check out with a real card, confirm the Stripe receipt email arrives.",
            },
            {
              done: false,
              item: "Switch the DNS for tende.care to point at Vercel instead of Squarespace. James will handle this — once done, tende.care will load the new site and tende-beta.vercel.app will still work as a backup.",
            },
            {
              done: false,
              item: "After DNS switches, update NEXT_PUBLIC_SITE_URL from tende-beta.vercel.app to tende.care, and re-register the Sanity webhook with the tende.care URL.",
            },
            {
              done: false,
              item: "Remove or password-protect the /for-sage and /palette pages if you'd prefer customers can't find them.",
            },
            {
              done: false,
              item: "Set up Shippo: create a free account at goshippo.com, grab an API key, and give it to James. He'll add your shipping address and the key to the site — after that, labels are auto-generated the moment an order is placed.",
            },
            {
              done: false,
              item: "Submit the site to Google Search Console (search.google.com/search-console) so Google knows the new site exists and starts indexing your product pages.",
            },
          ].map(({ done, item }, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className={`flex-shrink-0 mt-0.5 w-4 h-4 border rounded-sm flex items-center justify-center text-[10px] ${done ? "bg-teal border-teal text-white" : "border-foreground/30"}`}>
                {done ? "✓" : ""}
              </span>
              <p className={done ? "line-through text-foreground/40" : ""}>{item}</p>
            </div>
          ))}
        </div>
      </Section>

      <div className="mt-16 pt-8 border-t border-parchment text-xs text-muted font-sans text-center">
        This page is just for you — it&apos;s not linked anywhere on the site.
      </div>
    </div>
  );
}
