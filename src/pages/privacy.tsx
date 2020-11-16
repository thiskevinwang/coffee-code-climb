import React from "react"
import { graphql, PageProps } from "gatsby"

import { LayoutManager } from "components/layoutManager"
import SEO from "components/seo"

const PrivacyPage = ({ data, location }: PageProps<QueryProps>) => {
  const siteTitle = data.site.siteMetadata.title
  return (
    <LayoutManager location={location} title={siteTitle}>
      <SEO title="Privacy Policy" />
      <h1>Privacy Policy</h1>
      <h2>
        Your access to the Coffee Code Climb mobile applications and website is
        subject to the Coffee Code Climb Terms of Service and this Privacy
        Policy.
      </h2>
      <p>
        Coffee Code Climb has created this Privacy Policy to explain what
        information we gather from you when you use our apps and website, how we
        may use this information, the security approaches we use to protect your
        information, and how you can access and correct certain information that
        we may collect. This Privacy Policy is incorporated and made part of
        Coffee Code Climb Terms of Service.
      </p>
      <h2>Your acceptance of this privacy policy and changes to it</h2>
      <p>
        By using Coffee Code Climb, you consent to the collection and use of
        your information by Coffee Code Climb in accordance with this Privacy
        Policy. If you do not agree to this Privacy Policy, you may not use
        Coffee Code Climb. Coffee Code Climb reserves the right to change this
        Privacy Policy at any time, without prior notice. Changes take effect on
        the date that appears on the revised Policy. If you use this app
        following a change in the Policy, your use will be understood to signal
        that you accept the changes. We urge you to review this Privacy Policy
        frequently for changes.
      </p>
      <h2>What information do we collect?</h2>
      <p>
        We collect information from you when you register with Coffee Code
        Climb, respond to communication such as e-mail, or make use of another
        Coffee Code Climb feature.
      </p>
      <p>
        Coffee Code Climb's website uses cookies and local storage to enhance
        your experience and gather information about visitors and visits. Please
        refer to the "Cookies and local storage" section below for information
        about these mechanisms and how we use them.
      </p>
      <p>
        When signing up for pharmacy services or ordering prescription drugs, we
        may ask you to provide us with certain personal and/or health-related
        information. This information is subject to our Notice of Privacy
        Practices that more specifically describes how we may use or disclose
        your protected health information.
      </p>
      <h2>How do we use your information?</h2>
      <p>
        We may use the information we collect from you when you register,
        purchase products, respond to a survey or marketing communication, or
        use other Coffee Code Climb features in the following ways:
      </p>
      <p>
        To personalize your experience and to allow us to deliver the type of
        content and product offerings in which you are most interested.
      </p>
      <p>
        To allow us to better service you in responding to your customer service
        requests.
      </p>
      <p>To quickly process your transactions.</p>
      <p>To verify and validate your identity.</p>
      <p>To troubleshoot problems with Coffee Code Climb, as requested.</p>
      <p>
        To enforce the Coffee Code Climb Terms of Service, and to detect and
        protect against error, fraud and other unauthorized or illegal
        activities.
      </p>
      <p>
        To attempt to contact you regarding product safety or recall issues.
      </p>
      <p>To provide any legitimate business service or product.</p>
      <p>
        You understand that if you’re using Coffee Code Climb from a country
        outside the United States, you will be transferring personal information
        about yourself to the United States. You understand that the privacy
        laws of the United States may not be as comprehensive as those in your
        country, and you agree that the transfer of your personal information
        occurs with your consent. Personal information collected by Coffee Code
        Climb may be stored and processed in the United States or abroad.
      </p>
      <h2>Do we disclose the information we collect to outside parties?</h2>
      <p>
        We can disclose your personal and other information to third parties, as
        follows:
      </p>
      <p>
        To vendors whose products or services you have requested, in order to
        deliver those products or services to you.
      </p>
      <p>
        To our subsidiaries or affiliates, strategic partners and to third
        parties we engage to provide services on our behalf, such as web sites
        hosting, credit card payment processing, order processing, delivery,
        etc. We prohibit these parties from using your personal information for
        any other purpose.
      </p>
      <p>
        To vendors that offer products, services or other information we think
        might interest you. These third parties may keep and use your personal
        information whether or not you purchase their products or services. Your
        personal information will be subject to their privacy policies, so you
        should contact them directly for information on their policies or to
        opt-out of promotional communications from them.
      </p>

      <h2>Cookies and local storage</h2>
      <p>
        Cookies are small files that a site or its service provider transfers to
        your computer’s hard drive through your web browser (if you allow) that
        enables the site’s or service provider’s systems to recognize your
        browser and capture and remember certain information. Cookies help us in
        many ways to make your use of Coffee Code Climb more enjoyable and
        meaningful, such as understanding usage patterns and improving
        functionality of the website. For instance, we use cookies to help us
        understand your preferences based on previous or current website
        activity, which enables us to provide you with improved services. We
        also use cookies to help us compile aggregate data about website traffic
        and interaction so that we can offer better experiences and tools in the
        future. We may contract with third-party service providers to assist us
        in better understanding Coffee Code Climb visitors. These service
        providers are not permitted to use the information collected on our
        behalf except to help us conduct and improve our business.
      </p>
      <p>
        You can choose to have your computer warn you each time a cookie is
        being sent, or you can choose to turn off all cookies. You do this
        through your browser settings. If you turn cookies off, you won’t have
        access to many features that make your online experience more efficient
        and some of our services will not function properly.
      </p>
      <p>
        In addition to cookies, Coffee Code Climb uses browser local storage
        technology to store your preferences and make your user experience more
        consistent. Local storage is a persistent type of storage, that provides
        similar functionality to cookies, but its contents are not transmitted
        across the Internet, like cookies are.
      </p>
      <p>
        Like cookies, you can control how local storage works on your browser
        settings on a global or website specific manner. Disabling the local
        storage functionality on your browser may result in loss of
        functionality in the Coffee Code Climb website.
      </p>

      <h2>Safeguarding your personal information</h2>
      <p>
        Coffee Code Climb follows generally accepted industry security standards
        to safeguard and help prevent unauthorized access, maintain data
        security and correctly use such personal information. However, no
        commercial method of information transfer over the Internet or
        electronic data storage is known to be 100% secure. As a result, we
        cannot guarantee the absolute security of that information during its
        transmission or its storage in our systems. Other than the these
        security measures, you transmit data, including personal information, to
        us at your own risk.
      </p>

      <h2>Retention of your personal information</h2>
      <p>
        We will store the personal information you provide for as long as we
        believe is necessary or appropriate (i) to carry out the purpose(s) for
        which we collected it, or (ii) to comply with applicable laws,
        contracts, or other rules or regulations.
      </p>

      <h2>Questions and feedback</h2>
      <p>
        We welcome your questions, comments, and concerns about Coffee Code
        Climb. Please send us any and all feedback pertaining to Coffee Code
        Climb to kwangsan@gmail.com.
      </p>
      <p>
        The information contained in this Privacy Policy is subject to change
        without notice. Copyright 2020 Coffee Code Climb. All rights reserved.
      </p>

      <h4>Effective Date: Nov 15, 2020</h4>
    </LayoutManager>
  )
}

export default PrivacyPage

interface QueryProps {
  site: {
    siteMetadata: {
      title: string
    }
  }
}
export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
