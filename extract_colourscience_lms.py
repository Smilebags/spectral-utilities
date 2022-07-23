from colour.colorimetry import MSDS_CMFS_LMS, LMS_ConeFundamentals

def toFile(filename, list):
    file = open(filename, "w")
    for element in list:
        file.write(f"{element}\n")
    file.close()

cmfs: LMS_ConeFundamentals = MSDS_CMFS_LMS['Stockman & Sharpe 2 Degree Cone Fundamentals']
# print(cmfs.domain) # 390 - 830
toFile("CIE_S_390nm-830nm.txt", cmfs[:, 2])
