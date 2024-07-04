---
title: "A Robust Online Calibration Method for SINS/LDV Integrated Navigation System Based on Position Observation"
collection: publications
permalink: /publication/2023/2023-IEEEsensors
name: '<i><strong>Zhiyi Xiang</strong>, Qi Wang, Rong Huang, Shilong Jin, Xiaoming Nie, Jian Zhou<sup>*</sup></i>'
date: 2024-01-01
venue: 'IEEE Sensors Journal'
paperurl: '/files/pub/2023 IEEEsensors Calibration.pdf'
citation: 'Z. Xiang, Q. Wang, R. Huang, S. Jin, X. Nie, and J. Zhou, &quot;A Robust Online Calibration Method for SINS/LDV Integrated Navigation System Based on Position Observation,&quot; <i>IEEE. Sensors. J</i>, vol. 24, no. 1, p. 895-908, Jan. 2024.'
Bib: '/files/Bib/IEEEsensors-2023.bib'
Weblink: 'https://ieeexplore.ieee.org/abstract/document/10328480'
---
**Abstract**
------
The integration of strapdown inertial navigation system (SINS) with a laser Doppler velocimeter (LDV) has been proven to be a reliable technique for land vehicle localization. To enhance the positioning accuracy of the SINS/LDV integrated navigation system, accurate calibration is essential. Hence, this article proposes a robust position observation-based calibration method for the SINS/LDV integrated navigation system. In this method, the calibration process is partitioned into two phases: coarse calibration and fine calibration. In the coarse calibration phase, an analytical calibration method is adopted, and in the fine calibration phase, a robust Kalman filter is first designed to obtain the accurate vehicle attitude and position. Then, another Kalman filter is designed using an LDV error propagation model based on position observation to further calibrate the SINS/LDV integrated navigation system. To reduce the effect of the nonholonomic constraint (NHC) assumption violation on the calibration results during vehicle turning, z -gyro and LDV velocity outputs are used to detect whether the vehicle changes the direction and to compensate for the lateral velocity of the LDV in the LDV frame when the vehicle changes the direction. The performance of the proposed method is verified by two groups of vehicle field tests. The results show that the proposed method has higher calibration accuracy and stronger robustness than the three other compared methods. In the two groups of tests with total mileage of 76.9 and 65.34 km, the maximum dead reckoning (DR) horizontal positioning errors of the SINS/LDV integrated navigation system calibrated with the proposed method are 6.61 and 10.91 m, respectively.

------

**Keywords**
------
- SINS/LDV integrated navigation system
- Calibration
- Analytical calibration method
- Lateral velocity detection

------