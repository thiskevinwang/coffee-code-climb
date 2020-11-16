import React from "react"
import { graphql, PageProps } from "gatsby"

import { LayoutManager } from "components/layoutManager"
import SEO from "components/seo"

const TermsPage = ({ data, location }: PageProps<QueryProps>) => {
  const siteTitle = data.site.siteMetadata.title
  return (
    <LayoutManager location={location} title={siteTitle}>
      <SEO title="Terms of Service" />
      <h1>Terms of Service</h1>
      <h2>Agreement to Terms of Service</h2>
      <p>
        Your access to the Coffee Code Climb mobile applications and website is
        subject to the Coffee Code Climb Privacy Policy, and these Terms of
        Service.
      </p>
      <p>
        By using Coffee Code Climb, you agree to these Terms of Service. If you
        do not agree, do not use Coffee Code Climb.
      </p>
      <p>
        Coffee Code Climb may change, modify, add or remove portions of these
        Terms of Service, at any time. You should periodically check these Terms
        of Service for changes. Your continued use of Coffee Code Climb
        following the posting of any changes to these Terms of Service will mean
        that you accept and agree to such changes. As long as you comply with
        these Terms of Service, Coffee Code Climb grants you a personal,
        non-exclusive, non-transferable, limited privilege to access and use
        Coffee Code Climb.
      </p>
      <h2>Content</h2>
      <p>
        All information, data, software, photographs, graphics, videos, text,
        images, typefaces, sounds and other material (collectively “Content”),
        including but not limited to the selection, coordination, arrangement
        and enhancement of such Content, contained on Coffee Code Climb is
        owned, controlled or licensed by or to Coffee Code Climb, and is
        protected by trade dress, copyright, patent and trademark laws, and
        various other intellectual property rights and unfair competition laws.
      </p>
      <p>
        Except as expressly provided in these Terms of Service, no part of
        Coffee Code Climb and no Content may be copied, reproduced, republished,
        uploaded, posted, publicly displayed, encoded, translated, transmitted
        or distributed in any way (including “mirroring”) to any other computer,
        server, web site or other medium for publication or distribution or for
        any commercial enterprise, without Coffee Code Climb’s express prior
        written consent.
      </p>
      <p>
        You may not modify, remove, delete, augment, add to, publish, transmit,
        participate in the transfer or sale of, create derivative works from or
        in any way exploit any of the Content, in whole or in part. If no
        specific restrictions are displayed, you may make copies of select
        portions of the Content, provided that the copies are made only for your
        personal information and non-commercial use and that you do not alter or
        modify the Content in any way, and maintain any notices contained in the
        Content, such as all copyright notices, trademark legends or other
        proprietary rights notices.
      </p>
      <h2>Links to Third Party Sites</h2>
      <p>
        Coffee Code Climb may contain links to other independent third-party web
        sites. Coffee Code Climb provides these links for your reference only.
        Coffee Code Climb does not control these web sites, and Coffee Code
        Climb is not responsible for, and does not endorse, their content and
        resources or any services offered through such third-party web sites.
      </p>
      <h2>Privacy</h2>
      <p>
        Please review our Privacy Policy which also applies to your use of
        Coffee Code Climb.
      </p>
      <h2>Electronic Communications</h2>
      <p>
        When you use Coffee Code Climb or send e-mails to us, you are
        communicating with us electronically. You consent to receive
        communications from us electronically. We will communicate with you by
        e-mail or by posting notices within the Coffee Code Climb. You agree
        that all agreements, notices, disclosures and other communications that
        we provide to you electronically satisfy any legal requirement that such
        communications be in writing.
      </p>
      <h2>Your Conduct</h2>
      <p>
        You agree not to interrupt or attempt to interrupt Coffee Code Climb’s
        operation or any other person’s use of Coffee Code Climb in any way. Any
        conduct by you that, in our sole discretion, restricts, inhibits or
        interferes with the ability of any other user to enjoy Coffee Code Climb
        will not be permitted, including by means of hacking or defacing any
        portion of Coffee Code Climb, or by engaging in password “mining,”
        spamming, flooding or other disruptive activities.
      </p>
      <p>
        You may not use Coffee Code Climb or any Content for any purpose that is
        unlawful or prohibited by these Terms of Service, or to solicit the
        performance of any illegal activity or other activity which infringes
        the rights of Coffee Code Climb or others. You are prohibited from
        posting on or transmitting through Coffee Code Climb any unlawful,
        harmful, threatening, abusive, harassing, defamatory, vulgar, obscene,
        sexually explicit, profane, hateful, fraudulent or racially, ethnically,
        or otherwise objectionable material of any kind, including but not
        limited to any material that encourages conduct that would constitute a
        criminal offense, give rise to civil liability or otherwise violate any
        applicable local, state, national or international law. You may not use
        any “deep-link,” “page-scrape,” “robot,” “spider” or other automatic
        device, program, algorithm or methodology, or any similar or equivalent
        manual process, to access, acquire, copy or monitor any portion of
        Coffee Code Climb or any Content, or in any way reproduce or circumvent
        the navigational structure or presentation of Coffee Code Climb or any
        Content, to obtain or attempt to obtain any materials, documents or
        information through any means not purposely made available through
        Coffee Code Climb.
      </p>
      <p>
        Coffee Code Climb reserves the right to terminate or suspend your access
        to and use of Coffee Code Climb without notice, if we believe, in our
        sole discretion, that it is in violation of these Terms of Service or
        any applicable law or it is harmful to our interests or the interests,
        including intellectual property or other rights, of another user or
        other third-party.
      </p>
      <h2>Accounts, Passwords and Security</h2>
      <p>
        Certain information or services offered on or through Coffee Code Climb
        may require you to create an account (including setting up an email and
        password). You are responsible for maintaining the confidentiality of
        the information you hold for your account, including your password, and
        for all activities that occur in connection with your password or
        account. You agree to immediately notify us of any unauthorized use of
        either your password or account or any other breach of security. You
        further agree that you will not permit others, including those whose
        accounts have been terminated, to access Coffee Code Climb using your
        account. Coffee Code Climb cannot and will not be liable for any loss or
        damage arising from your failure to comply with these obligations.
      </p>
      <p>
        For your account, you agree to provide true, accurate, current and
        complete information about yourself. It is your responsibility to
        maintain and promptly update this account information to keep it true,
        accurate, current and complete. If you provide any information that is
        fraudulent, untrue, inaccurate, incomplete or not current, or we have
        reasonable grounds to suspect that such information is fraudulent,
        untrue, inaccurate, incomplete or not current, we reserve the right to
        suspend or terminate your account without notice and refuse any and all
        current and future use of Coffee Code Climb. Because any termination of
        your access to Coffee Code Climb may be effected without prior notice,
        you acknowledge and agree that we may immediately deactivate or delete
        your account and all related information and files in your account and
        bar any further access to such files or Coffee Code Climb. Furthermore,
        you agree that we shall not be liable to you or any third party for any
        termination of your access to your account or Coffee Code Climb.
      </p>
      <p>
        By using Coffee Code Climb, you also acknowledge and agree that Internet
        transmissions are never completely private or secure. You understand
        that any message or information you send to the Digital Experience may
        be read or intercepted by others, even if there is a special notice that
        a particular transmission (for example, credit card information) is
        encrypted.
      </p>
      <p>
        Your account Information and certain other information about you is
        subject to our Privacy Policy
      </p>
      <h2>Wireless Phone Policy</h2>
      <p>
        By providing your wireless phone number to Coffee Code Climb, you
        expressly consent to Coffee Code Climb calling you at this phone
        number—in person or through an automated system.
      </p>
      <h2>Disclaimers</h2>
      <p>
        Coffee Code Climb DOES NOT PROMISE THAT Coffee Code Climb OR ANY
        CONTENT, SERVICE OR FEATURE THEREOF WILL BE ERROR-FREE OR UNINTERRUPTED,
        OR THAT ANY DEFECTS WILL BE CORRECTED, OR THAT YOUR USE OF Coffee Code
        Climb WILL PROVIDE SPECIFIC RESULTS. Coffee Code Climb AND CONTENT ARE
        DELIVERED ON AN “AS-IS” AND “AS-AVAILABLE” BASIS, WITHOUT
        REPRESENTATIONS OR WARRANTIES OF ANY KIND. Coffee Code Climb CANNOT
        ENSURE THAT ANY FILES OR OTHER DATA YOU DOWNLOAD FROM THE SITE WILL BE
        FREE OF VIRUSES OR CONTAMINATION OR DESTRUCTIVE FEATURES.
      </p>
      <p>
        Coffee Code Climb DISCLAIMS ALL EXPRESS OR IMPLIED REPRESENTATIONS AND
        WARRANTIES REGARDING THE INFORMATION, SERVICES, PRODUCTS, MATERIALS AND
        ANY OTHER RESOURCES AVAILABLE ON OR ACCESSIBLE THROUGH THIS DIGITAL
        EXPERIENCE, INCLUDING ANY WARRANTIES OF ACCURACY, TITLE,
        NON-INFRINGEMENT, MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
      </p>
      <p>
        Coffee Code Climb DISCLAIMS ANY AND ALL LIABILITY FOR THE ACTS,
        OMISSIONS AND CONDUCT OF ANY THIRD PARTIES IN CONNECTION WITH OR RELATED
        TO YOUR USE OF THE DIGITAL EXPERIENCE AND/OR ANY Coffee Code Climb
        SERVICES. YOU ASSUME TOTAL RESPONSIBILITY FOR YOUR USE OF THE DIGITAL
        EXPERIENCE AND ANY LINKED SITES. YOUR SOLE REMEDY AGAINST Coffee Code
        Climb FOR DISSATISFACTION WITH THE DIGITAL EXPERIENCE OR ANY CONTENT IS
        TO STOP USING THE DIGITAL EXPERIENCE OR ANY SUCH CONTENT. THIS
        LIMITATION OF RELIEF IS A PART OF THE BARGAIN BETWEEN THE PARTIES.
      </p>
      <p>
        The above disclaimer applies to any damages, liability or injuries
        caused by any failure of performance, error, omission, interruption,
        deletion, defect, delay in operation or transmission, computer virus,
        communication line failure, theft or destruction of or unauthorized
        access to, alteration of or use, whether for breach of contract, tort,
        negligence or any other cause of action.
      </p>
      <p>
        Coffee Code Climb reserves the right to do any of the following, at any
        time, without notice: (i) to modify, suspend or terminate operation of
        or access to Coffee Code Climb, or any portion of thereof, for any
        reason; (ii) to modify or change the Coffee Code Climb, or any portion
        of thereof, and any applicable policies or terms; and (iii) to interrupt
        the operation of the Coffee Code Climb, or any portion of thereof, as
        necessary to perform routine or non-routine maintenance, error
        correction or other changes.
      </p>
      <h2>Limitations of Liability</h2>
      <p>
        IN NO EVENT WILL Coffee Code Climb BE LIABLE FOR ANY INDIRECT, PUNITIVE,
        INCIDENTAL, EXEMPLARY OR CONSEQUENTIAL DAMAGES, INCLUDING FOR LOSS OF
        PROFITS, GOOD WILL, USE, DATA OR OTHER INTANGIBLE LOSSES THAT RESULT
        FROM (i) THE USE OF OR INABILITY TO USE Coffee Code Climb, (ii) THE COST
        OF PROCUREMENT OF SUBSTITUTE GOODS AND SERVICES RESULTING FROM ANY
        GOODS, DATA, INFORMATION OR SERVICES PURCHASED OR OBTAINED OR MESSAGES
        RECEIVED OR TRANSACTIONS ENTERED INTO THROUGH OR FROM Coffee Code Climb
        (iii) UNAUTHORIZED ACCESS TO OR ALTERATION OF YOUR TRANSMISSIONS OR DATA
        ON Coffee Code Climb; (iv) STATEMENTS OR CONDUCT OF ANY THIRD PARTY ON
        Coffee Code Climb; OR (v) ANY OTHER MATTER RELATING TO THE DIGITAL
        EXPERIENCE, WHETHER IN CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION,
        EVEN IF Coffee Code Climb HAS BEEN ADVISED OF OR SHOULD HAVE KNOWN OF
        THE POSSIBILITY OF SUCH DAMAGES. IN JURISDICTIONS THAT DO NOT ALLOW THE
        EXCLUSION OR LIMITATION OF LIABILITY FOR INCIDENTAL OR CONSEQUENTIAL
        DAMAGES, SUCH LIMITATION SHALL NOT BE APPLICABLE TO YOU.
      </p>
      <p>
        If, notwithstanding the other provisions of these Terms of Service,
        Coffee Code Climb is found to be liable to you, any liability on the
        part of Coffee Code Climb will not exceed the fees paid by the user for
        the particular information or service provided. Coffee Code Climb is not
        liable for the unauthorized use of our Content by any other web sites.
      </p>
      <h2>Indemnification</h2>
      <p>
        You agree to indemnify and hold Coffee Code Climb, its officers,
        directors, shareholders, predecessors, successors in interest,
        employees, agents, subsidiaries and affiliates, harmless from any
        demands, loss, liability, claims or expenses (including attorneys’
        fees), made against Coffee Code Climb by any third party due to or
        arising out of or in connection to your violation of these Terms of
        Service, or with your use of this Digital Experience.
      </p>
      <h2>Governing Law; Choice of Forum; Dispute Resolution</h2>
      <p>
        If any part of these Terms of Service is determined by a court of
        competent jurisdiction to be invalid or unenforceable, it will not
        affect any other provision of these Terms of Service, all of which
        remain in full force and effect. You agree that all matters, including
        all disputes, relating to your access to or use of Coffee Code Climb
        information or services or of the Digital Experience, including its
        Contents, will be governed by the laws of the State of New York without
        regard to its conflicts of laws provisions. You agree to the personal
        jurisdiction by and venue in the state and federal courts for New York
        County, New York, and waive any objection to such jurisdiction or venue.
        Any claim under these Terms of Service must be brought within one (1)
        year after the cause of action arises, or such claim or cause of action
        is barred. In the event of any controversy or dispute between Coffee
        Code Climb and you arising out of or in connection with your access to
        or use of Coffee Code Climb information or Coffee Code Climb, including
        its Contents, the parties shall attempt, promptly and in good faith, to
        resolve any such dispute. If we are unable to resolve any such dispute
        within a reasonable time (not to exceed thirty (30) days), then either
        party may submit such controversy or dispute to mediation. If the
        dispute cannot be resolved through mediation, then the parties shall be
        free to pursue any right or remedy available to them under applicable
        law.
      </p>
      <h2>Feedback and Information</h2>
      <p>
        Coffee Code Climb welcomes your feedback. Any feedback you provide
        through Coffee Code Climb will be deemed to be non-confidential. Coffee
        Code Climb will be free to use such information on an unrestricted
        basis.
      </p>
      <h2>Copyright Infringement Complaints</h2>
      <p>
        Coffee Code Climb respects the intellectual property of others, and we
        ask our users to do the same. If you believe that your work has been
        copied and is accessible on Coffee Code Climb in a way that constitutes
        copyright infringement, you may notify us by providing our copyright
        agent the following information:
      </p>
      <ol>
        <li>
          an electronic or physical signature of the person authorized to act on
          behalf of the owner of the copyright interest;
        </li>

        <li>
          a description of the copyrighted work that you claim has been
          infringed, including the URL (i.e., web page address) of the location
          where the copyrighted work exists or a copy of the copyrighted work;
        </li>

        <li>
          identification of the URL or other specific location on the Digital
          Experience where the material that you claim is infringing is located;
        </li>

        <li>your address, telephone number and e-mail address;</li>

        <li>
          a statement by you that you have a good faith belief that the disputed
          use is not authorized by the copyright owner, its agent or the law;
        </li>

        <li>
          a statement by you, made under penalty of perjury, that the above
          information in your Notice is accurate and that you are the copyright
          owner or authorized to act on the copyright owner’s behalf.
        </li>
      </ol>
      <h2>General Information</h2>
      <p>
        Coffee Code Climb may elect to monitor areas of Coffee Code Climb by
        electronic or other means and may disclose any Content, records,
        Submissions or electronic communication of any kind (i) to satisfy any
        law, regulation or government request; (ii) if such disclosure is
        necessary or appropriate to operate Coffee Code Climb; or (iii) to
        protect our rights or property or the rights of the users, sponsors,
        providers, licensors or merchants. We are not responsible for screening,
        policing, editing or monitoring such Content. If notified of allegedly
        infringing, defamatory, damaging, illegal or offensive Content, we may
        investigate the allegation and determine in our sole discretion whether
        to remove or to request the removal of such Content from Coffee Code
        Climb.
      </p>
      <p>
        Coffee Code Climb’s failure to insist upon strict performance of any
        provision of these Terms of Service and policies will not be construed
        as an implicit waiver of any provision or right. These Terms of Service
        and policies constitute the entire agreement between you and Coffee Code
        Climb governing your use of Coffee Code Climb. As stated above, your use
        of this site is also subject to our Privacy Policy
      </p>
      <h2>Questions or Additional Information</h2>
      <p>Email: kwangsan@gmail.com</p>
      <p>
        The information contained in this web site is subject to change without
        notice. Copyright 2020 Coffee Code Climb. All rights reserved.
      </p>
      Last updated on November 15, 2020
    </LayoutManager>
  )
}

export default TermsPage

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
