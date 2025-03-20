-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 20, 2025 at 06:49 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `review_film`
--

-- --------------------------------------------------------

--
-- Table structure for table `author_requests`
--

CREATE TABLE `author_requests` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `author_requests`
--

INSERT INTO `author_requests` (`id`, `user_id`, `status`, `created_at`, `updated_at`) VALUES
(5, 15, 'approved', '2025-03-17 17:18:21', '2025-03-17 17:24:10');

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` int NOT NULL,
  `film_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  `content` text NOT NULL,
  `parent_comment_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `like_count` int DEFAULT '0',
  `dislike_count` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `film_id`, `user_id`, `content`, `parent_comment_id`, `created_at`, `like_count`, `dislike_count`) VALUES
(6, 19, 15, 'ha', NULL, '2025-03-08 11:55:57', 2, 0),
(27, 19, 8, 'nknj', 6, '2025-03-08 12:41:06', 1, 0),
(28, 19, 8, 'as', 6, '2025-03-08 12:48:28', 1, 0),
(29, 19, 8, 'as', 6, '2025-03-08 12:48:40', 1, 0),
(30, 19, 8, 'as', 6, '2025-03-08 14:08:48', 0, 0),
(31, 19, 8, 'as', NULL, '2025-03-08 14:08:55', 0, 0),
(32, 19, 8, 'as', 31, '2025-03-08 14:09:04', 0, 0),
(33, 19, 8, 'as', NULL, '2025-03-08 14:20:15', 0, 0),
(34, 19, 8, 'ass', 33, '2025-03-08 14:20:40', 0, 0),
(36, 19, 8, 'yyy', NULL, '2025-03-08 15:18:49', 0, 0),
(37, 19, 8, 'galih ganteng', 36, '2025-03-10 06:40:05', 0, 0),
(38, 19, 8, 'emh', 36, '2025-03-11 04:47:56', 0, 0),
(39, 19, 8, 'hellooo', 31, '2025-03-11 05:10:23', 0, 0),
(40, 21, 8, 'helloo', NULL, '2025-03-11 06:13:05', 0, 0),
(41, 19, 8, 'ka', 6, '2025-03-11 09:38:13', 0, 0),
(42, 19, 6, 'halloo', 6, '2025-03-11 11:48:13', 0, 0),
(43, 22, 8, 'gftftyfyff', NULL, '2025-03-12 05:07:32', 0, 0),
(44, 22, 8, 'gftftyfyff', NULL, '2025-03-12 05:07:32', 0, 0),
(45, 22, 8, 'gftftyfyff', NULL, '2025-03-12 05:07:32', 0, 0),
(46, 23, 15, 'hello', NULL, '2025-03-12 21:57:49', 0, 0),
(47, 23, 6, 'hello\n', NULL, '2025-03-17 16:07:37', 0, 0),
(48, 23, 6, 'hai juga', 46, '2025-03-17 16:07:46', 0, 0),
(49, 27, 6, 'haii hello', NULL, '2025-03-17 18:26:21', 0, 0),
(50, 23, 17, 'hello', NULL, '2025-03-18 04:07:19', 0, 0),
(51, 24, 8, 'heee', NULL, '2025-03-18 17:00:34', 0, 0),
(52, 30, 8, 'haii', NULL, '2025-03-19 02:18:22', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `comment_reactions`
--

CREATE TABLE `comment_reactions` (
  `id` int NOT NULL,
  `comment_id` int NOT NULL,
  `user_id` int NOT NULL,
  `reaction` enum('like','dislike') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `comment_reactions`
--

INSERT INTO `comment_reactions` (`id`, `comment_id`, `user_id`, `reaction`, `created_at`) VALUES
(4, 6, 15, 'like', '2025-03-08 11:56:09'),
(5, 6, 8, 'like', '2025-03-08 11:57:15'),
(12, 28, 8, 'like', '2025-03-08 12:48:47'),
(13, 29, 8, 'like', '2025-03-08 12:48:47'),
(14, 27, 8, 'like', '2025-03-08 13:15:14'),
(15, 31, 8, 'dislike', '2025-03-08 14:08:59'),
(16, 33, 8, 'like', '2025-03-08 15:15:24'),
(18, 30, 8, 'dislike', '2025-03-10 06:12:05'),
(19, 37, 8, 'like', '2025-03-10 06:40:43'),
(20, 36, 8, 'like', '2025-03-10 06:44:53'),
(21, 39, 8, 'like', '2025-03-11 05:10:27'),
(22, 38, 8, 'like', '2025-03-11 10:45:36'),
(23, 6, 6, 'like', '2025-03-11 11:48:28'),
(24, 31, 6, 'like', '2025-03-11 11:48:33'),
(25, 44, 8, 'like', '2025-03-12 05:07:51'),
(26, 40, 15, 'like', '2025-03-12 06:50:17'),
(27, 46, 15, 'like', '2025-03-12 21:57:58'),
(28, 47, 6, 'like', '2025-03-17 16:08:32'),
(29, 49, 6, 'like', '2025-03-18 01:08:12'),
(30, 50, 17, 'dislike', '2025-03-18 04:07:34'),
(31, 43, 16, 'like', '2025-03-20 04:25:21'),
(32, 43, 16, 'dislike', '2025-03-20 04:25:21');

-- --------------------------------------------------------

--
-- Table structure for table `favorites`
--

CREATE TABLE `favorites` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `film_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `favorites`
--

INSERT INTO `favorites` (`id`, `user_id`, `film_id`, `created_at`) VALUES
(27, 15, 23, '2025-03-12 22:22:55'),
(31, 8, 23, '2025-03-14 00:54:42'),
(33, 6, 22, '2025-03-14 19:28:04'),
(35, 6, 24, '2025-03-17 18:06:55');

-- --------------------------------------------------------

--
-- Table structure for table `films`
--

CREATE TABLE `films` (
  `id_film` int NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text,
  `min_age` int DEFAULT '0',
  `trailer_url` varchar(255) DEFAULT NULL,
  `cover_image` varchar(255) DEFAULT NULL,
  `id_tahun` int DEFAULT NULL,
  `id_negara` int DEFAULT NULL,
  `created_by` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `tanggal_rilis` date DEFAULT NULL,
  `durasi` int NOT NULL DEFAULT '0',
  `bg_image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `films`
--

INSERT INTO `films` (`id_film`, `title`, `description`, `min_age`, `trailer_url`, `cover_image`, `id_tahun`, `id_negara`, `created_by`, `created_at`, `updated_at`, `tanggal_rilis`, `durasi`, `bg_image`) VALUES
(19, 'Your Name.', 'Mitsuha, tujuh belas tahun, adalah siswa sekolah menengah di desa kecil Itomori. Setelah kehilangan ibunya, dia tinggal bersama adik perempuannya, Yotsuha, dan neneknya, Hitoha, sedangkan ayahnya meninggalkan rumah untuk menjadi walikota. Membagi waktunya antara studi, teman-temannya, dan perannya sebagai miko , yang ilmunya diwariskan kepadanya oleh neneknya, dia tercekik, dan memimpikan kehidupan lain sebagai seorang pemuda tampan di Tokyo . Di sisi lain, Taki adalah seorang siswa SMA Tokyo yang pemalu dan pandai menggambar. Saat tidak sedang berkumpul dengan teman-temannya di sekolah atau di kafe, ia bekerja sebagai pelayan di restoran Italia, di mana ia jatuh cinta pada rekan kerja yang lebih tua, Miki, tanpa pernah berani menyatakannya.\n\nSaat sebuah komet melintasi langit Itomori, takdir mereka akan berubah ketika mereka menyadari bahwa mereka masing-masing menemukan diri mereka dalam tubuh masing-masing dua atau tiga hari seminggu. Mereka dengan cepat mencoba berkomunikasi dan mengenal satu sama lain melalui pesan-pesan yang tertulis di tubuh mereka, kemudian di telepon genggam masing-masing, menetapkan aturan-aturan agar tidak mengganggu kehidupan masing-masing.', 17, 'https://youtu.be/NooIc3dMncc?si=1dj96fZSOUpfyenc', 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/q719jXXEzOoYaps6babgKnONONX.jpg', 10, 5, 8, '2025-03-07 01:10:19', '2025-03-18 19:23:46', '2016-02-11', 100, 'https://image.tmdb.org/t/p/w533_and_h300_bestv2/8x9iKH8kWA0zdkgNdpAew7OstYe.jpg'),
(21, 'Weathering with You ', 'Pada bulan Juni 2021, siswa sekolah menengah Hodaka Morishima kabur dari rumah. Ketika feri yang ditumpanginya menuju Tokyo dilanda hujan badai yang deras, ia hampir hanyut, tetapi diselamatkan oleh Keisuke Suga. Suga memberikan kartu namanya kepada anak laki-laki itu dan menyuruhnya menelepon jika ia membutuhkan pekerjaan. Hodaka berjuang keras mencari pekerjaan di kota itu. Ia menemukan pistol Makarov PM yang terbengkalai dan menyimpannya meskipun senjata api ilegal. [ a ] ​​Ia bertemu Hina Amano, seorang karyawan McDonald\'s , yang mengasihaninya dan memberinya makanan gratis. Suga mempekerjakannya sebagai asistennya; ia dan keponakannya menerbitkan majalah okultisme kecil yang menyelidiki fenomena aneh, termasuk cuaca hujan yang tidak biasa. Mereka mendengar legenda \"gadis sinar matahari\" yang dapat menghentikan hujan, dan membawa sinar matahari. Hodaka melihat Hina diintimidasi untuk bekerja di sebuah klub dan dengan panik, menembakkan senjatanya ke pemilik klub, nyaris mengenainya. Karena ketakutan, ia melempar senjatanya ke samping. Hina membawanya ke Yoyogi Kaikan, sebuah bangunan terbengkalai dengan kuil di atapnya, dan membuatnya kagum dengan menunjukkan kemampuannya untuk membersihkan langit dengan berdoa. Hodaka mengetahui bahwa Hina adalah seorang yatim piatu yang tinggal sendirian dengan adik laki-lakinya Nagi. Melihat bahwa mereka juga dalam kesulitan keuangan, Hodaka mengusulkan agar mereka memulai bisnis dengan meminta Hina untuk membersihkan cuaca untuk acara kumpul-kumpul. Bisnis mereka menjadi sukses, tetapi Hina difilmkan dan ditayangkan di televisi, yang menyebabkan situs mereka dibanjiri permintaan. Mereka memutuskan untuk menghentikan sementara bisnis agar Hina bisa beristirahat. Sementara itu, Suga dan Natsumi mewawancarai pendeta tua dari sebuah kuil yang menceritakan kepada mereka legenda \"Gadis Cuaca\" yang dapat mengendalikan hujan, menambahkan bahwa mereka membayar harga yang mahal untuk kekuatan mereka.', 17, 'https://youtu.be/Q6iK6DjV_iE?si=9ZEBXIBq9rFvJpbA', 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/qgrk7r1fV4IjuoeiGS5HOhXNdLJ.jpg', 8, 5, 8, '2025-03-11 05:51:52', '2025-03-11 09:59:57', '2222-12-22', 112, 'https://image.tmdb.org/t/p/w1920/jFK8BOPL6ZeWyjMVWX8ajsTTinp.jpg'),
(22, 'Suzume', 'Suzume Iwato adalah seorang gadis SMA yatim piatu berusia tujuh belas tahun yang tinggal bersama bibinya di sebuah kota di Kyushu . Dia memiliki mimpi berulang tentang dirinya di masa kecil berjalan melalui lanskap kota yang hancur di malam hari, sebelum bertemu dengan sosok bayangan yang dia yakini sebagai mendiang ibunya. Dalam perjalanan ke sekolah suatu pagi, Suzume bertemu dengan seorang pemuda yang sedang mencari lokasi terbengkalai dengan pintu. Dia memberi tahu dia tentang resor onsen terbengkalai di dekatnya , dan dengan penasaran mengikutinya. Di sana, dia menemukan sebuah pintu berdiri bebas di kusennya. Suzume membukanya untuk melihat ladang berbintang melalui ambang pintu, yang tidak bisa dia masuki. Dia kemudian tersandung patung kucing di lantai, yang berubah menjadi kucing sungguhan dan melarikan diri. Ketakutan, Suzume bergegas ke sekolah.\n\nSaat makan siang, Suzume melihat kepulan asap besar dari lokasi resor terbengkalai, yang tidak dapat dilihat orang lain. Dia kembali ke sana dan menemukan pria tadi, tengah berjuang menutup pintu tempat asap keluar. Suzume membantunya, dan dia mengunci pintu dengan kunci lama. Asap yang menyerupai cacing itu menghilang, tetapi tidak sebelum menyebabkan kerusakan akibat gempa bumi di kota itu.\n\nSuzume membawa pria yang terluka, Souta Munakata, ke rumahnya. Dia menjelaskan bahwa dia adalah seorang \"Closer\" dan harus menemukan dan mengunci pintu-pintu tertentu di tempat-tempat terlantar di seluruh Jepang untuk mencegah \"cacing\" supernatural terlepas dan menyebabkan gempa bumi. Saat mereka berbicara, kucing dari resor muncul dan mengubah Souta menjadi kursi yang dia duduki. Souta, yang sekarang menjadi kursi berkaki tiga yang hidup, mengejar kucing itu ke feri yang menuju Ehime , dengan Suzume mengikutinya. Kucing itu melompat ke kapal lain saat Souta memberi tahu Suzume bahwa kucing itu adalah \"batu kunci\", dan bahwa cacing itu terlepas setelah batu kunci itu dilepas dari pintu resor.', 13, 'https://youtu.be/F7nQ0VUAOXg?si=EzH8mT2mbGcWTUit', 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/x5CrIflmv8WZJeLv7V611aRGbPs.jpg', 5, 5, 8, '2025-03-11 06:48:25', '2025-03-11 09:52:46', '2006-11-23', 122, 'https://image.tmdb.org/t/p/w1920/4tdV5AeojEdbvn6VpeQrbuDlmzs.jpg'),
(23, 'Sword Art Online the Movie – Progressive – Aria of a Starless Night', 'Pada tahun 2022, Akihiko Kayaba menciptakan sebuah permainan peran daring multipemain masif realitas virtual (VRMMORPG) bernama Sword Art Online ( SAO ). Seperti yang digambarkan dalam volume pertama dari seri novel ringan Sword Art Online: Progressive , NerveGear adalah perangkat FullDive generasi ke-2 yang dikembangkan oleh sebuah perusahaan bernama Argus, dengan Kayaba sebagai penciptanya. Perangkat ini memiliki antarmuka tunggal yang menutupi seluruh kepala pemain. Perangkat ini mengendalikan kesadaran pemain dengan mengarahkan sinyal otak ke NerveGear, sehingga pemain dapat merasakan dan mengendalikan karakter dalam permainan dengan pikiran mereka tanpa gerakan fisik apa pun. Perangkat ini memiliki sumber baterai sendiri, serta pemancar gelombang mikro elektromagnetik frekuensi tinggi.\n\nPada tanggal 6 November 2022, 10.000 pemain masuk ke SAO untuk pertama kalinya, tetapi kemudian menyadari bahwa mereka tidak dapat keluar dari permainan. Kayaba muncul dan memberi tahu para pemain bahwa mereka harus mengalahkan semua 100 lantai Aincrad, kastil baja raksasa yang menjadi latar SAO jika mereka ingin keluar dari permainan. Hanya dengan begitu mereka dapat keluar. Mati di dalam permainan atau NerveGear mereka dicabut paksa dari kepala mereka akan menyebabkan otak mereka dihancurkan oleh NerveGear, sehingga mereka juga akan terbunuh di dunia nyata.\n\nAsuna, yang telah masuk ke dalam permainan untuk bermain dengan teman sekolahnya Misumi Tozawa, atau Mito dalam permainan, awalnya berjuang untuk mengatasi kenyataan barunya terjebak di dalam permainan. Setelah menjadi penguji beta asli, Mito menggunakan pengalaman sebelumnya untuk membantu Asuna naik level dengan cepat dengan membunuh monster jauh di luar kota awal di mana pemain non-beta tidak akan menyadarinya, dan keduanya membentuk sebuah kelompok. Beberapa minggu kemudian, Asuna dan Mito berangkat untuk membunuh nepenthes , monster berbasis tanaman yang terletak di daerah pegunungan di lantai. Mito memperingatkan Asuna bahwa membunuh nepenthes dengan bola di atas kepalanya akan menyebabkannya memuntahkan asap dan memicu serangan besar-besaran tanaman di dekatnya, dan untuk menghindarinya dengan cara apa pun. Selama pertempuran, Mito pergi untuk menangkap seorang penipu licik yang langka dan selama waktu itu Asuna tanpa sadar membunuh nepenthes dengan bola di atas kepala, memicu serangan gencar mereka. Mito mencoba menyelamatkan Asuna tetapi terdorong jatuh dari tebing oleh tanaman dan tidak dapat mencapainya saat nepenthes mulai bergerak menuruni gunung untuk menyerangnya. Melihat bar kesehatan Asuna turun ke level yang berbahaya, Mito panik dan meninggalkan kelompok mereka yang baru terbentuk. Asuna menerima pemberitahuan tentang pembubaran kelompok tepat pada waktunya untuk diserang oleh monster yang lebih berbahaya setelah membunuh semua nepenthes. Sebelum dia terbunuh, Kirito datang dan menghabisi monster itu. Dia menawarkan ramuan penyembuh dan peta kembali ke kota terdekat sebelum tiba-tiba pergi.', 17, 'https://youtu.be/J3-lSaS2rlU?si=-WVy551olTJ9OaYH', 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/yD9RhgIVydQNBK7OLEbCWYcWMUd.jpg', 4, 5, 8, '2025-03-12 04:19:06', '2025-03-12 04:19:06', '2021-10-30', 97, 'https://image.tmdb.org/t/p/w1920/2kvl6lcgoyAaf8cSRkzxE611u6T.jpg'),
(24, 'Avengers: Endgame', 'Dua puluh tiga hari setelah Thanos menggunakan Infinity Gauntlet untuk menghancurkan setengah dari seluruh kehidupan di alam semesta, Carol Danvers menyelamatkan Nebula dan Tony Stark, yang terdampar di luar angkasa setelah pertarungan mereka dengan Thanos. Mereka bergabung dengan Natasha Romanoff, Bruce Banner, Steve Rogers, Rocket, Thor, Pepper Potts, dan James Rhodes di Bumi. Kelompok itu menemukan Thanos disebuah planet terpencil dan berencana untuk merebut dan menggunakan batu Infinity dan membalikkan tindakannya, tetapi Thanos telah menghancurkan batu tersebut untuk mencegah digunakan kembali. Thor yang marah akhirnya memenggal Thanos.[3]\n\nLima tahun kemudian, Scott Lang keluar dari alam kuantum. Ia pergi ke markas Avengers, di mana ia menjelaskan kepada Romanoff dan Rogers bahwa ia hanya melalui lima jam di alam kuantum, bukan lima tahun. dan ia berteori bahwa alam kuantum dapat memungkinkan mereka melakukan perjalanan waktu ke masa lalu, Ketiganya meminta Stark — yang sekarang membesarkan seorang putri, Morgan, bersama Pepper — agar mereka mengambil batu Infinity dari masa lalu dan menggunakannya untuk mengembalikan tindakan Thanos di masa sekarang. Stark menolak gagasan itu karena takut kehilangan Morgan, tetapi mengalah setelah merenungkan Peter Parker yang hancur. Stark bekerja bersama Banner, yang telah menyatukan kepintarannya dan kekuatan Hulk, untuk mendesain perangkat untuk melakukan perjalanan waktu. Banner memperingatkan bahwa mengubah masa lalu tidak mengubah masa kini dan perubahan sedikitpun dapat menciptakan realita yang berbeda. Ia dan Rocket pergi ke rumah baru pengungsi Asgard di Norwegia - New Asgard - untuk merekrut Thor, yang kini menjadi pemabuk gemuk, putus asa karena kegagalannya dalam menghentikan Thanos. Di Tokyo, Romanoff merekrut Clint Barton, yang kini menjadi seorang pejuang jalanan setelah keluarganya menghilang.\n\nBanner, Lang, Rogers, dan Stark pergi ke Kota New York pada tahun 2012. Banner mengunjungi Sanctum Sanctorum dan meyakinkan Ancient One untuk memberinya Batu Waktu. Rogers berhasil mengambil Batu Pikiran, namun Stark dan Lang tidak sengaja membiarkan Loki dari tahun 2012 untuk kabur dengan Batu Angkasa. Rogers dan Stark pergi ke markas S.H.I.E.L.D. pada tahun 1970, di mana Stark mengambil versi awal dari Batu Angkasa dan bertemu dengan Howard Stark muda saat mengambilnya, sedangkan Rogers mengambil beberapa Partikel Pym dari Hank Pym untuk kembali ke masa kini. Rocket dan Thor pergi ke Asgard pada tahun 2013, mengekstrak Batu Realita dari Jane Foster dan mengambil palu Thor, Mjolnir. Nebula dan Rhodes pergi ke Morag pada tahun 2014 dan mencuri Batu Kekuatan sebelum Peter Quill dapat mencurinya. Rhodes kembali ke masa kini dengan Batu Kekuatan, namun Nebula tidak sadarkan diri ketika implan cyberneticnya berhubungan dengan dirinya dari masa lalu. Melalui hubungan ini, Thanos 2014 mempelajari mengenai keberhasilannya di masa depan dan keinginan Avengers untuk membalikkannya. Thanos menangkap Nebula 2023 dan mengirim Nebula 2014 ke masa kini untuk menggantikannya. Barton dan Romanoff pergi ke Vormir, di mana sang penjaga Batu Jiwa, Red Skull, memberitahu mereka bahwa batu tersebut hanya dapat diambil dengan mengorbankan seseorang yang mereka cintai. Romanoff mengorbankan dirinya, dan Barton mengambil Batu Jiwa.', 13, 'https://youtu.be/TcMBFSGVi1c?si=-a4riMyldo8feFri', 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg', 8, 7, 6, '2025-03-17 18:00:57', '2025-03-17 18:00:57', '2019-04-22', 181, 'https://image.tmdb.org/t/p/w1920/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg'),
(25, 'Spider-Man: No Way Home', 'Setelah Quentin Beck menjebak Peter Parker atas pembunuhannya dan mengungkapkan identitas Parker sebagai Spider-Man,[a] Parker, kekasihnya Michelle \"MJ\" Jones-Watson, sahabatnya Ned Leeds, dan bibi May diinterogasi oleh Departemen Pengendalian Kerusakan. Pengacara Matt Murdock berhasil membatalkan tuntutan Parker, namun kelompok ini bergulat dengan publisitas negatif. Setelah aplikasi MIT Parker, MJ, dan Ned ditolak, Parker pergi ke New York Sanctum untuk meminta bantuan Stephen Strange. Strange mulai merapal mantra yang akan membuat semua orang lupa bahwa Parker adalah Spider-Man, namun mantra tersebut rusak ketika Parker berulang kali meminta perubahan agar orang-orang yang dicintainya tetap memiliki ingatan, yang pada akhirnya membuat Strange menahan mantra tersebut untuk menghentikannya.\n\nAtas saran Strange, Parker mencoba meyakinkan administrator MIT untuk mempertimbangkan kembali aplikasi MJ dan Ned, tetapi diserang oleh Otto Octavius. Octavius merobek nanoteknologi dari kostum Iron Spider milik Parker, yang terikat dengan tentakel mekanisnya dan memungkinkan Parker untuk mengendalikannya. Saat Norman Osborn tiba dan menyerang, Strange memindahkan Parker kembali ke Sanctum dan mengunci Octavius di dalam sel di samping Curt Connors. Strange menjelaskan bahwa mantra yang rusak itu memanggil orang-orang dari alam semesta lain dalam multiverse yang mengetahui identitas Spider-Man. Dia memerintahkan Parker, MJ, dan Ned untuk menemukan dan menangkap mereka; mereka menemukan dan mengambil Max Dillon dan Flint Marko di sebuah fasilitas penelitian militer.', 13, 'https://youtu.be/JfVOs4VSpmA?si=QaZLiurtsQTvZuIf', 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg', 4, 7, 6, '2025-03-17 18:17:21', '2025-03-17 18:17:21', '2021-12-15', 148, 'https://image.tmdb.org/t/p/w1920/zD5v1E4joAzFvmAEytt7fM3ivyT.jpg'),
(27, 'Doctor Strange in the Multiverse of Madness ', 'America Chavez dan Defender Strange dikejar oleh iblis di dalam ruang antar semesta sambil mencari Kitab Vishanti. Strange terbunuh dan Chavez secara tidak sengaja membuat portal yang membawa dirinya dan mayat Strange menuju Earth-616,[N 1] tempat Strange versi semesta tersebut menyelamatkan Chavez dari iblis gurita dengan bantuan dari Sorcerer Supreme, Wong. Chavez menjelaskan bahwa iblis tersebut memburunya karena ia memiliki kekuatan untuk melakukan perjalanan multisemesta.\n\nMenyadari tanda sihir pada iblis tersebut, Strange meminta bantuan Wanda Maximoff tetapi menyadari bahwa Wanda-lah yang bertanggung jawab atas serangan tersebut. Setelah memperoleh Darkhold dan menjadi Scarlet Witch, Maximoff percaya bahwa mengendalikan kekuatan Chavez akan memungkinkannya untuk bersatu kembali dengan Billy dan Tommy, anak-anak yang diciptakannya selama di Westview.[N 2] Saat Strange menolak menyerahkan Chavez, Maximoff menyerang Kamar-Taj, dan membunuh banyak penyihir. Chavez secara tidak sengaja membawa dirinya dan Strange ke Earth-838 sementara Maximoff menggunakan Darkhold untuk \"dream-walk\", mengambil alih rekannya dari Earth-838, yang menjalani kehidupan di pinggiran kota dengan Billy dan Tommy. Seorang penyihir yang masih hidup mengorbankan dirinya untuk menghancurkan Darkhold dan menghentikan dream-walk. Merasa marah, Maximoff memaksa Wong untuk membawanya ke sebuah kuil di Gunung Wundagore, reruntuhan kuno terlarang yang merupakan sumber mantra Darkhold, dan memulai kembali dream-walk.\n\nSaat mencari bantuan, Strange dan Chavez ditangkap oleh Sorcerer Supreme Earth-838, Karl Mordo, dan dibawa ke hadapan Illuminati, sebuah kelompok yang terdiri dari Mordo, Peggy Carter, Blackagar Boltagon, Maria Rambeau, Reed Richards, dan Charles Xavier. Mereka menjelaskan bahwa dengan penggunaan sembrono dari Darkhold semesta mereka dalam upaya untuk mengalahkan Thanos, Strange Earth-838 memicu \"inkursi\" yang menghancurkan semesta. Setelah mengalahkan Thanos melalui cara lain, Illuminati mengeksekusi Strange mereka untuk mencegahnya menyebabkan lebih banyak kerusakan. Mordo percaya bahwa Strange Earth-616 sama berbahayanya, tetapi Maximoff telah tiba dalam tubuh rekannya dari Earth-838 sebelum mereka memberikan penilaian. Ia secara brutal membunuh semua anggota Illuminati kecuali Mordo, yang ditaklukkan oleh Strange sebelum melarikan diri bersama Chavez. Keduanya melarikan diri dengan bantuan rekan Earth-838 dari mantan tunangan Strange Christine Palmer, seorang ilmuwan Illuminati.', 17, 'https://youtu.be/aWzlQ2N6qqg?si=d4Gvev1jPzbqFqM2', 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/ddJcSKbcp4rKZTmuyWaMhuwcfMz.jpg', 5, 7, 6, '2025-03-17 18:23:45', '2025-03-17 18:23:45', '2022-05-06', 126, 'https://image.tmdb.org/t/p/w1920/iKUwhA4DUxMcNKu5lLSbDFwwilk.jpg'),
(30, 'hello ', 'aasdadasd', 12, 'https://youtu.be/NooIc3dMncc?si=behnegHPxQEv5iBH', 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/a8B3bagkYRULdmnhgKMcxXaVcFm.jpg', 8, 5, 14, '2025-03-19 02:14:49', '2025-03-19 02:14:49', '2221-02-12', 12, 'https://image.tmdb.org/t/p/w533_and_h300_bestv2/yFZG86Zvdy6JuIlMW9eHxlVkct5.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `film_genres`
--

CREATE TABLE `film_genres` (
  `id` int NOT NULL,
  `film_id` int NOT NULL,
  `genre_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `film_genres`
--

INSERT INTO `film_genres` (`id`, `film_id`, `genre_id`) VALUES
(166, 19, 4),
(167, 19, 13),
(165, 19, 15),
(168, 19, 16),
(119, 21, 4),
(120, 21, 9),
(121, 21, 11),
(116, 22, 4),
(117, 22, 9),
(118, 22, 11),
(122, 23, 3),
(123, 23, 4),
(125, 23, 12),
(124, 23, 14),
(126, 24, 3),
(127, 24, 12),
(128, 24, 14),
(129, 25, 3),
(130, 25, 12),
(132, 25, 13),
(134, 25, 14),
(137, 27, 3),
(140, 27, 5),
(138, 27, 12),
(139, 27, 15),
(178, 30, 3),
(175, 30, 4),
(176, 30, 6),
(177, 30, 13);

-- --------------------------------------------------------

--
-- Table structure for table `genre`
--

CREATE TABLE `genre` (
  `id_genre` int NOT NULL,
  `nama_genre` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `genre`
--

INSERT INTO `genre` (`id_genre`, `nama_genre`, `created_at`, `updated_at`) VALUES
(3, 'Action', NULL, NULL),
(4, 'Romance', NULL, NULL),
(5, 'Horror ', NULL, NULL),
(6, 'School', NULL, NULL),
(9, 'Mystery', NULL, NULL),
(10, 'Shounen', NULL, NULL),
(11, 'Harem', NULL, NULL),
(12, 'Adventure', NULL, NULL),
(13, 'Drama', NULL, NULL),
(14, 'Sci-Fi', NULL, NULL),
(15, 'Fantasy', NULL, NULL),
(16, 'Supernatural', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `negara`
--

CREATE TABLE `negara` (
  `id_negara` int NOT NULL,
  `nama_negara` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `negara`
--

INSERT INTO `negara` (`id_negara`, `nama_negara`, `created_at`, `updated_at`) VALUES
(4, 'Indonesia', NULL, NULL),
(5, 'Jepang', NULL, NULL),
(6, 'Korea Selatan', NULL, NULL),
(7, 'Amerika Serikat', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `ratings`
--

CREATE TABLE `ratings` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `film_id` int NOT NULL,
  `rating` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ;

--
-- Dumping data for table `ratings`
--

INSERT INTO `ratings` (`id`, `user_id`, `film_id`, `rating`, `created_at`, `updated_at`) VALUES
(12, 6, 22, 37, '2025-03-14 17:31:20', '2025-03-14 19:21:23'),
(26, 6, 23, 23, '2025-03-14 19:03:55', '2025-03-18 06:54:08'),
(44, 6, 24, 88, '2025-03-17 18:07:47', '2025-03-17 18:07:47'),
(50, 8, 25, 18, '2025-03-18 06:46:41', '2025-03-18 06:46:41'),
(52, 16, 24, 9, '2025-03-18 06:49:07', '2025-03-18 06:49:07'),
(56, 6, 25, 28, '2025-03-18 06:54:15', '2025-03-18 06:54:15'),
(58, 8, 21, 40, '2025-03-18 06:56:31', '2025-03-18 06:56:31'),
(67, 8, 23, 100, '2025-03-18 16:43:33', '2025-03-20 03:17:38'),
(70, 8, 22, 38, '2025-03-18 16:50:27', '2025-03-18 16:50:27'),
(72, 8, 24, 98, '2025-03-18 17:00:20', '2025-03-20 03:17:59'),
(74, 6, 27, 40, '2025-03-18 19:34:57', '2025-03-18 19:34:57'),
(76, 16, 23, 34, '2025-03-19 03:58:51', '2025-03-19 03:58:55'),
(81, 16, 22, 51, '2025-03-20 04:24:50', '2025-03-20 04:25:05');

-- --------------------------------------------------------

--
-- Table structure for table `tahun`
--

CREATE TABLE `tahun` (
  `id_tahun` int NOT NULL,
  `tahun_rilis` year NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tahun`
--

INSERT INTO `tahun` (`id_tahun`, `tahun_rilis`, `created_at`, `updated_at`) VALUES
(4, 2021, NULL, NULL),
(5, 2022, NULL, NULL),
(6, 2024, NULL, NULL),
(7, 2025, NULL, NULL),
(8, 2019, NULL, NULL),
(9, 2017, NULL, NULL),
(10, 2016, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','author','admin') NOT NULL DEFAULT 'user',
  `age` int DEFAULT NULL,
  `telpon` varchar(15) DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `age`, `telpon`, `profile_picture`, `created_at`) VALUES
(6, 'Raiden', 'raidenei@gmail.com', '$2a$10$gYWXdXVJi6WECG/J46giIO/SKD7wXnrEo7dqRWPWCKAiMwutWxfrm', 'author', 18, NULL, '/uploads/purple_eyes_hair_baal_raiden_shogun_with_sword_4k_5k_hd_genshin_impact-2560x1440.jpg', '2025-02-10 19:39:11'),
(8, 'Furinaaaa', 'furinaaa@gmail.com', '$2a$10$xJwkLsy.SklMqhOTrD6dlemIfYZ3hrxGgrcUFCaZl4l9ocJl/EQkW', 'author', 18, NULL, '/uploads/Furina-Genshin-Impact.jpg', '2025-02-12 03:35:47'),
(12, 'SangAdmin', 'admin@gmail.com', ' $2a$10$jjwuL4S/IGXk/ozfYKmCFOVhJOzFXxmq68lLQG0oz4dleXYoCtZri', 'admin', 18, NULL, '/uploads/product-3.png', '2025-02-12 04:50:09'),
(13, 'Aquaa', 'aqua@gmail.com', ' $2a$10$jjwuL4S/IGXk/ozfYKmCFOVhJOzFXxmq68lLQG0oz4dleXYoCtZri', 'author', 18, NULL, '/uploads/Sword Art Online Progressive - Aria of a Starless Night - 2021 (Film (REBOOT de la Série).jpg', '2025-02-14 18:00:44'),
(14, 'HoshinoRuby', 'ruby@gmail.com', '$2a$10$/jfrci6/kG41.B6vvx1TD.y4xCYH9qLq.4uawBxEut9CEFwCd6hui', 'admin', 18, NULL, '/uploads/images.jpg', '2025-02-21 05:06:19'),
(15, 'Nahidaa', 'nahida@gmal.com', '$2a$10$I58slfVTkxHLKoCbphc2H.FRPgwOcUcypxtaX046RbkaM.zvrmr1u', 'author', 12, NULL, '/uploads/images (1).jpg', '2025-03-06 18:30:53'),
(16, 'Zhonglie', 'zhong@gmail.com', '$2a$10$YsWNn7uRjw7z5H0W3Qupm.PkPTLmL/17BOGSvdJl4QA6iUjxs6Oty', 'user', 21, NULL, '/uploads/images (2).jpg', '2025-03-18 02:29:07'),
(17, 'Novaaa', 'nova@gmail.com', '$2a$10$7GqqLd6g9ytYRz2ZtJn95uc8xpQb7NS7wftRolXiICjt9VqOFBNNO', 'user', 118, NULL, '/uploads/images (2).jpg', '2025-03-18 04:05:07'),
(18, 'Furinaaaaaa', 'novaard@gmail.com', '12345678', 'user', 18, NULL, '/uploads/Nahida_Shorts_2022-11-02-1000x768.jpg', '2025-03-18 04:12:04'),
(19, 'admin', 'aaaa@gmail.com', '12345678', 'user', 11, NULL, '/uploads/images (2).jpg', '2025-03-18 04:19:33'),
(20, 'novaaaaa', 'nova23@gmail.com', '12345678', 'user', 18, '085643490265', '/uploads/images (2).jpg', '2025-03-18 04:29:19');

-- --------------------------------------------------------

--
-- Table structure for table `watchlist`
--

CREATE TABLE `watchlist` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `film_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `watchlist`
--

INSERT INTO `watchlist` (`id`, `user_id`, `film_id`, `created_at`) VALUES
(14, 8, 23, '2025-03-14 16:55:02');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `author_requests`
--
ALTER TABLE `author_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `parent_comment_id` (`parent_comment_id`),
  ADD KEY `fk_film_id` (`film_id`);

--
-- Indexes for table `comment_reactions`
--
ALTER TABLE `comment_reactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `comment_id` (`comment_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `film_id` (`film_id`);

--
-- Indexes for table `films`
--
ALTER TABLE `films`
  ADD PRIMARY KEY (`id_film`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `id_tahun` (`id_tahun`),
  ADD KEY `id_negara` (`id_negara`);

--
-- Indexes for table `film_genres`
--
ALTER TABLE `film_genres`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_film_genre` (`film_id`,`genre_id`),
  ADD KEY `genre_id` (`genre_id`);

--
-- Indexes for table `genre`
--
ALTER TABLE `genre`
  ADD PRIMARY KEY (`id_genre`);

--
-- Indexes for table `negara`
--
ALTER TABLE `negara`
  ADD PRIMARY KEY (`id_negara`);

--
-- Indexes for table `ratings`
--
ALTER TABLE `ratings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_film` (`user_id`,`film_id`),
  ADD KEY `film_id` (`film_id`);

--
-- Indexes for table `tahun`
--
ALTER TABLE `tahun`
  ADD PRIMARY KEY (`id_tahun`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `watchlist`
--
ALTER TABLE `watchlist`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `film_id` (`film_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `author_requests`
--
ALTER TABLE `author_requests`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `comment_reactions`
--
ALTER TABLE `comment_reactions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `favorites`
--
ALTER TABLE `favorites`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `films`
--
ALTER TABLE `films`
  MODIFY `id_film` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `film_genres`
--
ALTER TABLE `film_genres`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=188;

--
-- AUTO_INCREMENT for table `genre`
--
ALTER TABLE `genre`
  MODIFY `id_genre` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `negara`
--
ALTER TABLE `negara`
  MODIFY `id_negara` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `ratings`
--
ALTER TABLE `ratings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tahun`
--
ALTER TABLE `tahun`
  MODIFY `id_tahun` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `watchlist`
--
ALTER TABLE `watchlist`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `author_requests`
--
ALTER TABLE `author_requests`
  ADD CONSTRAINT `author_requests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_ibfk_3` FOREIGN KEY (`parent_comment_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_film_id` FOREIGN KEY (`film_id`) REFERENCES `films` (`id_film`) ON DELETE CASCADE;

--
-- Constraints for table `comment_reactions`
--
ALTER TABLE `comment_reactions`
  ADD CONSTRAINT `comment_reactions_ibfk_1` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comment_reactions_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`film_id`) REFERENCES `films` (`id_film`);

--
-- Constraints for table `films`
--
ALTER TABLE `films`
  ADD CONSTRAINT `films_ibfk_3` FOREIGN KEY (`id_tahun`) REFERENCES `tahun` (`id_tahun`) ON DELETE SET NULL,
  ADD CONSTRAINT `films_ibfk_4` FOREIGN KEY (`id_negara`) REFERENCES `negara` (`id_negara`) ON DELETE SET NULL;

--
-- Constraints for table `film_genres`
--
ALTER TABLE `film_genres`
  ADD CONSTRAINT `film_genres_ibfk_1` FOREIGN KEY (`film_id`) REFERENCES `films` (`id_film`) ON DELETE CASCADE,
  ADD CONSTRAINT `film_genres_ibfk_2` FOREIGN KEY (`genre_id`) REFERENCES `genre` (`id_genre`) ON DELETE CASCADE;

--
-- Constraints for table `ratings`
--
ALTER TABLE `ratings`
  ADD CONSTRAINT `ratings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `ratings_ibfk_2` FOREIGN KEY (`film_id`) REFERENCES `films` (`id_film`);

--
-- Constraints for table `watchlist`
--
ALTER TABLE `watchlist`
  ADD CONSTRAINT `watchlist_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `watchlist_ibfk_2` FOREIGN KEY (`film_id`) REFERENCES `films` (`id_film`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
