use shopDEV;
CREATE TABLE `users` (
	`usr_id` int NOT NULL AUTO_INCREMENT,
    `usr_age` int DEFAULT '0',
    `usr_status` INT DEFAULT '0',
    `usr_name` varchar(120) COLLATE utf8mb4_bin DEFAULT NULL,
    `usr_email` varchar(120) COLLATE utf8mb4_bin DEFAULT NULL,
    `usr_address` varchar(120) COLLATE utf8mb4_bin DEFAULT NULL,
    
    PRIMARY KEY (`usr_id`),
    KEY `idx_email_age_name` (`usr_email`, `usr_age`, `usr_name`),
    KEY `idx_status` (`usr_status`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_bin;

INSERT INTO users (usr_id, usr_age, usr_status, usr_name, usr_email, usr_address) VALUES (
	1, 36, 1, 'Messi', 'messi@anonystick.com', '137, HCM CITY'
);
INSERT INTO users (usr_id, usr_age, usr_status, usr_name, usr_email, usr_address) VALUES (
	2, 38, 0, 'Ronaldo', 'messi@anonystick.com', '138, HCM CITY'
);
INSERT INTO users (usr_id, usr_age, usr_status, usr_name, usr_email, usr_address) VALUES (
	3, 39, 1, 'Anonystick', 'messi@anonystick.com', '139, HCM CITY'
);

EXPLAIN SELECT * FROM users WHERE usr_id = 1;

-- index = idx_email_age_name
EXPLAIN SELECT * FROM users WHERE usr_email = 'messi@anonystick.com';
EXPLAIN SELECT * FROM users WHERE usr_email = 'messi@anonystick.com' AND usr_age = 36;
EXPLAIN SELECT * FROM users WHERE usr_email = 'messi@anonystick.com' AND usr_age = 36 AND usr_name = 'Messi';

EXPLAIN SELECT * FROM users WHERE usr_age = 36;
EXPLAIN SELECT * FROM users WHERE usr_name = 'Messi';
EXPLAIN SELECT * FROM users WHERE usr_name = 'Messi' AND usr_age = 36;

-- SELECT *
EXPLAIN SELECT usr_email, usr_name FROM users WHERE usr_name = 'Messi';	

-- idx_status
EXPLAIN SELECT * FROM users WHERE SUBSTR(usr_status, 1, 2) = 1;
EXPLAIN SELECT * FROM users WHERE usr_status = '1';

SELECT concat(1 + '1') = ? // => 2;

-- LIKE % 
EXPLAIN SELECT * FROM users where usr_email like 'messi@%';
EXPLAIN SELECT * FROM users where usr_email like '%messi@'; => mất chỉ mục
EXPLAIN SELECT * FROM users where usr_email like '%messi@%'; => mất chỉ mục

-- OR 
EXPLAIN SELECT * FROM users where usr_id = 1 OR usr_status = 0;
EXPLAIN SELECT * FROM users where usr_id = 1 OR usr_status = 0 OR usr_address = 'abc'; => mất chỉ mục, tất cả các điều kiện phải đều được lập chỉ mục

-- ORDER BY
EXPLAIN SELECT * FROM users where usr_email = 'abc' ORDER BY usr_email, usr_name;
EXPLAIN SELECT * FROM users ORDER BY usr_email, usr_name; => mất chỉ mục
