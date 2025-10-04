import { Metadata } from 'next';
import Image from 'next/image';
import styles from './page.module.css';

import about_image1 from '@/assets/images/abouts/about_1.png';
import about_image2 from '@/assets/images/abouts/about_2.png';
import about_image3 from '@/assets/images/abouts/about_3.png';
import about_image4 from '@/assets/images/abouts/about_4.png';
import { notoSerif } from '@/common/fonts';

export const metadata: Metadata = {
  title: 'Về chúng tôi',
  description:
    'Anvita – cửa hàng thuốc Đông dược uy tín. Sản phẩm thảo dược an toàn, chất lượng, hỗ trợ chăm sóc sức khỏe tự nhiên và bền vững cho mọi nhà.',
  icons: {
    icon: '/favicon.ico',
  },
};

function AboutPage() {
  return (
    <div className={styles.container}>
      <h1 className={notoSerif.className}>Chúng tôi là ai?</h1>

      <div className={styles.about}>
        <h2>Anvita – An tâm từ thiên nhiên</h2>

        <div className={styles.info}>
          <div className={styles.imageContainer}>
            <Image src={about_image1} className={styles.image} alt="logo" />
          </div>
          <div className={styles.text}>
            <p>
              Trong cuộc sống hiện đại, khi áp lực công việc, môi trường ô nhiễm
              và thói quen sinh hoạt không điều độ ngày càng ảnh hưởng đến sức
              khỏe, nhiều người bắt đầu tìm về những giá trị chữa lành từ thiên
              nhiên.
            </p>
            <p>
              Anvita được hình thành từ mong muốn gìn giữ tinh hoa y học cổ
              truyền Việt Nam, kết hợp cùng sự chọn lọc, nghiên cứu hiện đại để
              mang đến những sản phẩm Đông dược vừa an toàn, vừa hiệu quả, lại
              thân thiện với cơ thể.
            </p>
            <p>
              Với triết lý “An tâm từ thiên nhiên”, chúng tôi không chỉ cung cấp
              sản phẩm, mà còn đồng hành cùng khách hàng trong hành trình chăm
              sóc và phục hồi sức khỏe bền vững.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.about}>
        <h2>Đội ngũ bác sĩ – Người bạn đồng hành tận tâm</h2>

        <div className={styles.info}>
          <div className={styles.text}>
            <p>
              Anvita tự hào sở hữu đội ngũ bác sĩ, lương y, và chuyên gia y học
              cổ truyền dày dặn kinh nghiệm. Họ không chỉ là những người nghiên
              cứu và bào chế mà còn là những “người thầy thuốc” thực sự quan tâm
              đến sức khỏe toàn diện của từng khách hàng.
            </p>

            <ul>
              <li>
                <p>
                  Kinh nghiệm và chuyên môn: Các bác sĩ, lương y được đào tạo
                  bài bản, có nhiều năm gắn bó với y học cổ truyền.
                </p>
              </li>
              <li>
                <p>
                  Tận tâm tư vấn: Luôn lắng nghe câu chuyện, thói quen sinh
                  hoạt, thể trạng của mỗi người để đưa ra liệu trình phù hợp,
                  không áp đặt.
                </p>
              </li>
              <li>
                <p>
                  Kết hợp Đông – Tây y: Hiểu rõ sự khác biệt nhưng cũng bổ sung
                  lẫn nhau giữa hai nền y học, giúp mang lại giải pháp toàn diện
                  và khoa học.
                </p>
              </li>
            </ul>

            <p>
              Tại Anvita, bạn không chỉ tìm thấy một sản phẩm Đông dược, mà còn
              tìm thấy một người bạn đồng hành y tế tin cậy.
            </p>
          </div>
          <div className={styles.imageContainer}>
            <Image src={about_image2} className={styles.image} alt="logo" />
          </div>
        </div>
      </div>

      <div className={styles.about}>
        <h2>Nguồn cung cấp thảo dược – Từ nông trại đến tay bạn</h2>
        <div className={styles.info}>
          <div className={styles.imageContainer}>
            <Image src={about_image3} className={styles.image} alt="logo" />
          </div>
          <div className={styles.text}>
            <p>
              Chúng tôi tin rằng, một sản phẩm tốt phải bắt đầu từ nguyên liệu
              tốt. Vì thế, Anvita hợp tác với các vùng trồng đạt chuẩn GACP-WHO
              – chuẩn mực quốc tế trong trồng và thu hái dược liệu.
            </p>

            <ul>
              <li>
                <p>
                  Thảo dược sạch, tự nhiên: Cam kết không sử dụng hóa chất độc
                  hại trong quá trình nuôi trồng.
                </p>
              </li>
              <li>
                <p>
                  Quy trình kiểm định nghiêm ngặt: Mỗi vị thuốc đều được kiểm
                  tra chất lượng nhiều bước trước khi đưa vào bào chế.
                </p>
              </li>
              <li>
                <p>
                  Minh bạch nguồn gốc: Mọi sản phẩm Anvita đều có thể truy xuất
                  nguồn gốc rõ ràng, giúp khách hàng an tâm tuyệt đối.
                </p>
              </li>
            </ul>

            <p>
              Mỗi lá, mỗi rễ, mỗi thảo dược mà Anvita lựa chọn đều mang trong
              mình năng lượng tinh khiết của thiên nhiên, được gìn giữ để trao
              đến bạn một giải pháp an toàn và lành tính.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.about}>
        <h2>Đội ngũ vận chuyển – Gửi gắm sự an tâm</h2>
        <div className={styles.info}>
          <div className={styles.text}>
            <p>
              Anvita hiểu rằng, khi bạn cần đến sản phẩm chăm sóc sức khỏe, điều
              quan trọng nhất chính là sự nhanh chóng và an toàn. Vì vậy, chúng
              tôi xây dựng hệ thống vận chuyển chuyên nghiệp, đảm bảo mỗi sản
              phẩm được trao đến tay bạn một cách trọn vẹn.
            </p>

            <ul>
              <li>
                <p>
                  Giao hàng toàn quốc: Từ thành phố đến vùng xa, sản phẩm luôn
                  đến nơi đúng hẹn.
                </p>
              </li>
              <li>
                <p>
                  Đóng gói cẩn thận: Mỗi đơn hàng được chuẩn bị tỉ mỉ, chắc
                  chắn, giữ nguyên chất lượng sản phẩm.
                </p>
              </li>
              <li>
                <p>
                  Hỗ trợ tận tình: Đổi trả linh hoạt, giải đáp thắc mắc nhanh
                  chóng, để khách hàng luôn cảm thấy an tâm và hài lòng.
                </p>
              </li>
            </ul>

            <p>
              Đằng sau mỗi chuyến hàng, không chỉ là những hộp thuốc Đông dược,
              mà còn là sự tận tâm và niềm tin mà Anvita gửi gắm.
            </p>
          </div>
          <div className={styles.imageContainer}>
            <Image src={about_image4} className={styles.image} alt="logo" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
